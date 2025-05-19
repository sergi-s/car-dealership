// ColorOptions.jsx
const ColorOptions = ({ title, colors, name }) => {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div className="filter-colors">
        {colors.map((color, index) => (
          <label key={index} className="color-option" title={color.title}>
            <input
              type="checkbox"
              name={name}
              value={color.value}
              className="color-checkbox"
            />
            <span
              className="color-swatch"
              style={{ backgroundColor: color.color }}
            ></span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorOptions;
