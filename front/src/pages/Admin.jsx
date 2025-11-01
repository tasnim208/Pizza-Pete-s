import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: ''
  });

  const BACKEND_URL = "http://localhost:5003";
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        const normalUsers = data.users.filter(user => !user.isAdmin);
        setUsers(normalUsers);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setIsError(true);
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) {
      return;
    }

    if (userId === currentUser.id) {
      setIsError(true);
      setMessage('❌ Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage('✅ Utilisateur supprimé avec succès');
        fetchUsers();
        fetchStats();
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setIsError(true);
      setMessage('❌ ' + error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || ''
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage('✅ Utilisateur modifié avec succès');
        setEditingUser(null);
        fetchUsers();
      } else {
        throw new Error(data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setIsError(true);
      setMessage('❌ ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        width: '100%'
      }}>
        <div className="spinner"></div>
        Chargement...
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body, #root {
          width: 100%;
          height: 100%;
        }

        body {
          font-family: system-ui, sans-serif;
          background: #f8f9fa;
          width: 100%;
        }

        .admin-container {
          min-height: 100vh;
          padding: 20px;
          width: 100%;
        }

        .admin-header {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 30px;
          border-left: 5px solid #e74c3c;
          width: 100%;
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          width: 100%;
        }

        .admin-title h1 {
          color: #2c3e50;
          font-size: 2.5em;
          width: 100%;
        }

        .crown-icon {
          font-size: 2em;
          color: #f39c12;
        }

        .user-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          width: 100%;
        }

        .welcome-text {
          font-size: 1.2em;
          color: #7f8c8d;
          width: auto;
        }

        .logout-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          width: auto;
        }

        .logout-btn:hover {
          background: #c0392b;
          transform: translateY(-2px);
        }

        .admin-notice {
          background: #e8f4fd;
          border: 1px solid #b6d7f2;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #2c3e50;
          width: 100%;
        }

        .admin-notice h3 {
          margin: 0 0 10px 0;
          color: #2980b9;
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
          width: 100%;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
          border-top: 4px solid #e74c3c;
          width: 100%;
        }

        .stat-number {
          font-size: 2.5em;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
          width: 100%;
        }

        .stat-label {
          color: #7f8c8d;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.9em;
          width: 100%;
        }

        .users-section {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
          width: 100%;
        }

        .section-header {
          padding: 25px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          width: 100%;
        }

        .section-header h2 {
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #e9ecef;
          width: 100%;
        }

        .users-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          vertical-align: middle;
          width: 100%;
        }

        .users-table tr {
          width: 100%;
        }

        .users-table tr:hover {
          background: #f8f9fa;
        }

        .user-role {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8em;
          font-weight: 600;
          text-transform: uppercase;
          width: auto;
        }

        .role-user {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 0.9em;
          width: auto;
        }

        .btn-edit {
          background: #3498db;
          color: white;
        }

        .btn-edit:hover {
          background: #2980b9;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        .btn-cancel {
          background: #95a5a6;
          color: white;
        }

        .btn-cancel:hover {
          background: #7f8c8d;
        }

        .btn-save {
          background: #27ae60;
          color: white;
        }

        .btn-save:hover {
          background: #219a52;
        }

        .edit-form {
          background: #f8f9fa;
          padding: 20px;
          margin: 10px 0;
          border-radius: 8px;
          border-left: 4px solid #3498db;
          width: 100%;
        }

        .form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          width: 100%;
        }

        .form-group {
          flex: 1;
          width: 100%;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9em;
          width: 100%;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3498db;
        }

        .message {
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 8px;
          font-weight: 500;
          width: 100%;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .spinner {
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
          width: 100%;
        }

        .empty-state .pizza-icon {
          font-size: 4em;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .admin-container {
            padding: 10px;
            width: 100%;
          }

          .user-info {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            width: 100%;
          }

          .users-table {
            display: block;
            overflow-x: auto;
            width: 100%;
          }

          .users-table th,
          .users-table td {
            white-space: nowrap;
            min-width: 120px;
          }

          .form-row {
            flex-direction: column;
            width: 100%;
          }

          .action-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
          }
        }

        /* Pour les très grands écrans */
        @media (min-width: 1200px) {
          .admin-container {
            max-width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title">
            <span className="crown-icon">👑</span>
            <h1>Administration Pizza Pete's</h1>
          </div>
          
          <div className="user-info">
            <div className="welcome-text">
              Bienvenue <strong>{currentUser?.firstName}</strong> | {currentUser?.email}
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="admin-notice">
          <h3>🔒 Zone d'administration sécurisée</h3>
        </div>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalRegularUsers}</div>
              <div className="stat-label">Utilisateurs normaux</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalAdmins}</div>
              <div className="stat-label">Administrateurs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Utilisateurs totaux</div>
            </div>
          </div>
        )}

        <div className="users-section">
          <div className="section-header">
            <h2>
              <span>👥</span>
              Gestion des utilisateurs ({users.length})
            </h2>
            <p style={{ marginTop: '10px', color: '#7f8c8d', fontSize: '0.9em', width: '100%' }}>
              Seuls les utilisateurs normaux sont affichés ici
            </p>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <div className="pizza-icon">🍕</div>
              <h3>Aucun utilisateur trouvé</h3>
              <p>Aucun utilisateur normal n'est inscrit pour le moment.</p>
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="users-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Utilisateur</th>
                    <th style={{ width: '20%' }}>Email</th>
                    <th style={{ width: '25%' }}>Adresse</th>
                    <th style={{ width: '10%' }}>Rôle</th>
                    <th style={{ width: '15%' }}>Date d'inscription</th>
                    <th style={{ width: '15%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td>
                          <strong>{user.firstName} {user.lastName}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          {user.address ? (
                            `${user.address}, ${user.city}, ${user.state}`
                          ) : (
                            <span style={{color: '#95a5a6', fontStyle: 'italic'}}>
                              Non renseignée
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="user-role role-user">
                            Utilisateur
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn btn-edit"
                              onClick={() => handleEditUser(user)}
                              disabled={editingUser === user._id}
                            >
                              Modifier
                            </button>
                            <button 
                              className="btn btn-delete"
                              onClick={() => handleDeleteUser(user._id, user.email)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {editingUser === user._id && (
                        <tr>
                          <td colSpan="6" style={{ width: '100%' }}>
                            <form className="edit-form" onSubmit={handleUpdateUser}>
                              <h4 style={{ marginBottom: '15px', color: '#2c3e50', width: '100%' }}>
                                Modifier l'utilisateur: {user.firstName} {user.lastName}
                              </h4>
                              
                              <div className="form-row">
                                <div className="form-group">
                                  <label>Prénom *</label>
                                  <input
                                    type="text"
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Nom *</label>
                                  <input
                                    type="text"
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div className="form-group">
                                <label>Email *</label>
                                <input
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <label>Adresse</label>
                                <input
                                  type="text"
                                  value={editForm.address}
                                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                  placeholder="Adresse de livraison"
                                />
                              </div>

                              <div className="form-row">
                                <div className="form-group">
                                  <label>Ville</label>
                                  <input
                                    type="text"
                                    value={editForm.city}
                                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                                    placeholder="Ville"
                                  />
                                </div>
                                <div className="form-group">
                                  <label>État/Département</label>
                                  <input
                                    type="text"
                                    value={editForm.state}
                                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                                    placeholder="État ou département"
                                  />
                                </div>
                              </div>

                              <div style={{ 
                                background: '#e8f4fd', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                margin: '15px 0',
                                fontSize: '0.9em',
                                color: '#2c3e50',
                                width: '100%'
                              }}>
                              </div>

                              <div className="action-buttons">
                                <button type="submit" className="btn btn-save">
                                  Enregistrer les modifications
                                </button>
                                <button type="button" className="btn btn-cancel" onClick={cancelEdit}>
                                  Annuler
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;