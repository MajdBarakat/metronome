export default ({ value, label, onClick }) => {
  return (
    <div className="checkbox-container">
      <div
        className={"checkbox " + (value ? "active" : "")}
        onClick={onClick}
      />
      <label onClick={onClick}>
        <p>{label}</p>
      </label>
    </div>
  );
};
