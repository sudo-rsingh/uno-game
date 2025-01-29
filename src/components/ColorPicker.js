const ColorPicker = ({ onSelect }) => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    
    return (
      <div className="color-picker">
        {colors.map(color => (
          <button
            key={color}
            className={`color-option ${color}`}
            onClick={() => onSelect(color)}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  };
  
  export default ColorPicker;