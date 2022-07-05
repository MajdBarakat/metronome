export default ({ value, min, max, inc, onChange, onClick }) => {
  return (
    <div className="slider-container">
      <button className="dec" onClick={() => onClick(value - inc)} />
      <input
        id="slider"
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
      />
      <button className="inc" onClick={() => onClick(value + inc)} />
    </div>
  );
};
