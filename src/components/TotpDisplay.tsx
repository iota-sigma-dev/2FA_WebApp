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
      </div>
    </div>
  );
};
