import React from "react";

export default ({ prevBeat, beatCount, onClick }) => {
  const renderMetronome = (beatCount) => {
    let arr = [];
    for (let i = 1; i <= beatCount; i++) {
      arr.push(
        <div key={i} className={`beat ${prevBeat === i ? "active" : ""}`} />
      );
    }
    return arr;
  };
  return (
    <React.Fragment>
      <h2>{prevBeat}</h2>
      <div className="metronome-container">
        <button className="dec" onClick={() => onClick(beatCount - 1)} />
        {renderMetronome(beatCount)}
        <button className="inc" onClick={() => onClick(beatCount + 1)} />
      </div>
    </React.Fragment>
  );
};
