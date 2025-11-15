import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      padding: '20px'
    }}>
      <h1>Bienvenue {user?.firstName} 🍕</h1>
      <p>Vous êtes maintenant connecté à Pizza Pete's.</p>
      
      {/* 🆕 NOUVEAU BOUTON PROFIL */}
      <div style={{ margin: '30px 0' }}>
        <button 
          onClick={() => window.location.href = '/profile'}
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            marginRight: '10px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#2980b9';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#3498db';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          👤 Mon Profil
        </button>

        {user?.isAdmin && (
          <button 
            onClick={() => window.location.href = '/admin'}
            style={{
              background: '#f39c12',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#e67e22';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f39c12';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            👑 Accéder à l'administration
          </button>
        )}
      </div>
      
      <button 
        onClick={handleLogout}
        style={{
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Home;