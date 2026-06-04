import { useState, useEffect } from 'react';
import { authenticator } from '@otplib/preset-browser';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { TotpDisplay } from './components/TotpDisplay';

// Configuración global (estática para la demo)
const SECRET = 'JBSWY3DPEHPK3PXP'; // Base32 compatible
const ISSUER = 'Charla Identidad Digital';
const ACCOUNT = 'Demo2FA';

function App() {
  const [token, setToken] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    const updateTotp = () => {
      // Calcular segundos restantes basándose en el epoch time actual
      // Esto asegura que estemos sincronizados con Google/Microsoft Authenticator
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epoch % 30);
      
      setTimeRemaining(remaining);
      // Generar el token actual para el secreto estático
      setToken(authenticator.generate(SECRET));
    };

    // Ejecutar inicialmente
    updateTotp();

    // Actualizar exactamente cada segundo
    const interval = setInterval(updateTotp, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Simulador 2FA (TOTP)</h1>
        <p>Abre tu aplicación Authenticator y escanea el código QR</p>
      </header>
      
      <main className="app-main">
        <TotpDisplay token={token} timeRemaining={timeRemaining} />
        <QRCodeDisplay secret={SECRET} issuer={ISSUER} account={ACCOUNT} />
      </main>
      
      <footer className="app-footer">
        <p>RFC 6238 Compatible | HMAC-SHA1 | Período de 30s</p>
      </footer>
    </div>
  );
}

export default App;
