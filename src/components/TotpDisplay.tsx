interface TotpDisplayProps {
  token: string;
  timeRemaining: number;
}

export const TotpDisplay = ({ token, timeRemaining }: TotpDisplayProps) => {
  // Formatear el token para que tenga un espacio en el medio (e.g. 123 456)
  const formattedToken = token.length === 6 ? `${token.slice(0, 3)} ${token.slice(3)}` : token;

  // Calcular el porcentaje para la barra de progreso
  const progressPercentage = (timeRemaining / 30) * 100;
  
  // Cambiar color si queda poco tiempo (menos de 5 segundos)
  const isUrgent = timeRemaining <= 5;

  return (
    <div className="totp-container">
      <div className="totp-display">
        <h2 className="totp-title">Código de Autenticación</h2>
        <div className={`totp-code ${isUrgent ? 'urgent' : ''}`}>
          {formattedToken}
        </div>
        
        <div className="progress-container">
          <div 
            className={`progress-bar ${isUrgent ? 'progress-urgent' : ''}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="time-text">
          Se actualizará en {timeRemaining} {timeRemaining === 1 ? 'segundo' : 'segundos'}
        </div>
        
        <div className="auth-links-container">
          <p className="auth-links-title">Descargá tu app de autenticación desde el PlayStore:</p>
          <div className="auth-links-list">
            <a 
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="auth-link google-auth"
            >
              {/* Icono representativo de Google Authenticator (Escudo/Safe) */}
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Google Authenticator
            </a>
            
            <a 
              href="https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="auth-link ms-auth"
            >
              {/* Icono representativo de Microsoft Authenticator (Candado) */}
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Microsoft Authenticator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
