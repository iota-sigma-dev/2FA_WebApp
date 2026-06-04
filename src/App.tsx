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
      // 1. Programar el PRÓXIMO tick de forma inmediata y sincrónica,
      //    ANTES de cualquier operación async. Esto garantiza que el scheduling
      //    no acumule el delay de crypto.subtle (~2-5ms por llamada).
      const msUntilNextSecond = 1000 - (Date.now() % 1000);
      timerId = setTimeout(tick, msUntilNextSecond);

      // 2. Actualizar el countdown con el reloj real del sistema
      setTimeRemaining(getTimeRemaining());

      // 3. Generar el token (async) y actualizar la UI
      const newToken = await generateTOTP(SECRET);
      setToken(newToken);
    };

    // Alinear el primer tick al próximo boundary de segundo del sistema,
    // y actualizar la UI de forma inmediata mientras tanto.
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    timerId = setTimeout(tick, msUntilNextSecond);

    // Actualización inmediata al montar (sin esperar al próximo segundo)
    (async () => {
      setTimeRemaining(getTimeRemaining());
      setToken(await generateTOTP(SECRET));
    })();

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
