import React from 'react';
import '../styles/plants.css'; 

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} GreenGuide. All rights reserved.</p>
    </footer>
  );
}
export default Footer;