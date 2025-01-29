const Card = ({ card, onClick }) => {
    const getSymbol = () => {
      switch (card.value) {
        case 'skip': return '⏸';
        case 'reverse': return '🔄';
        case 'draw2': return '+2';
        case 'wild': return 'W';
        case 'wild4': return 'W+4';
        default: return card.value;
      }
    };
  
    return (
      <div
        className={`card ${card.color}`}
        onClick={onClick}
        style={{ backgroundColor: card.color === 'wild' ? 'black' : card.color }}
      >
        <span className="card-value">{getSymbol()}</span>
      </div>
    );
  };
  
  export default Card;