import React from 'react';
import '../styles/plants.css'; 

function Footer() {
  return (
    <footer className="footer" style={{ padding: '20px', textAlign: 'center', background: '#2e7d32', color: 'white' }}>
      <p>© {new Date().getFullYear()} GreenGuide. All rights reserved.</p>
    </footer>
  );
}

export default Footer;  