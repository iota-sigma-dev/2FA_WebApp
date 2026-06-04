import { useState, useEffect } from 'react';
import { generateTOTP, getTimeRemaining } from './totp';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { TotpDisplay } from './components/TotpDisplay';

// Configuración estática de la demo (QR fijo, PIN rota cada 30s)
const SECRET = 'JBSWY3DPEHPK3PXP';
const ISSUER = 'Charla Identidad Digital';
const ACCOUNT = 'Demo2FA';

function App() {
  const [token, setToken] = useState('------');
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const tick = async () => {
      // Leer el tiempo real del sistema en cada tick
      setTimeRemaining(getTimeRemaining());
      const newToken = await generateTOTP(SECRET);
      setToken(newToken);

      // Calcular los ms exactos que faltan para el próximo segundo del reloj.
      // Esto ancla cada disparo al boundary real y elimina el drift acumulado
      // de setInterval (que no garantiza exactitud).
      const msUntilNextSecond = 1000 - (Date.now() % 1000);
      timerId = setTimeout(tick, msUntilNextSecond);
    };

    tick();
    return () => clearTimeout(timerId);
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
        <p>RFC 6238 Compatible · HMAC-SHA1 · Período 30s · Web Crypto API</p>
      </footer>
    </div>
  );
}

export default App;
