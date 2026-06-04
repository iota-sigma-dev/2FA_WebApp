import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  secret: string;
  issuer: string;
  account: string;
}

/** Formatea el secreto en grupos de 4 caracteres para facilitar la lectura manual */
function formatSecret(secret: string): string {
  return secret.toUpperCase().replace(/(.{4})/g, '$1 ').trim();
}

export const QRCodeDisplay = ({ secret, issuer, account }: QRCodeDisplayProps) => {
  const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

  return (
    <div className="qr-container">
      <div className="qr-card">
        <QRCodeSVG
          value={otpauth}
          size={560}
          level={"Q"}
          includeMargin={true}
          className="qr-code"
        />
        <div className="qr-instructions">
          <h3>Escanea con tu Auth App</h3>
          <p>Usa Google Authenticator o Microsoft Authenticator</p>
        </div>
        <div className="qr-manual">
          <p className="qr-manual-text">
            O ingresa de manera manual este código en tu app de autenticación:
          </p>
          <span className="qr-secret-code">{formatSecret(secret)}</span>
          <p className="qr-manual-hint">Recuerda seleccionar <strong>basado en tiempo (TOTP)</strong></p>
        </div>
      </div>
    </div>
  );
};
