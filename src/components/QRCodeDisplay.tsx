import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  secret: string;
  issuer: string;
  account: string;
}

export const QRCodeDisplay = ({ secret, issuer, account }: QRCodeDisplayProps) => {
  // Construir la URI para la aplicación de autenticación (Google/Microsoft Authenticator)
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
      </div>
    </div>
  );
};
