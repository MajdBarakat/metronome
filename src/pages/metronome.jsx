import React, { Component } from "react";
import CheckBoxInput from "../components/checkBoxInput";
import MetronomeCounter from "../components/metronomeCounter";
import Slider from "../components/slider";
import TempoMarking from "../components/tempoMarking";

class Metronome extends Component {
  state = {
    isPlaying: false,
    beatCount: 4,
    prevBeat: 0,
    currentBeat: 1,
    tempo: 100,
    min: 20,
    max: 250,
    prevClick: null,
    err: null,
    isCollapsed: true,
    stressOn: true,
    skippingOn: false,
    isLightTheme: localStorage.getItem("isLightTheme"),
  };

  min = 20;
  max = 250;
  inc = 1;
  skip = false;
  scheduleAheadTime = 0.1;
  audioContext = null;
  nextNoteTime = 0;
  interval = null;
  intervalVisual = null;

  schedule = (time) => {
    const { tempo, currentBeat, beatCount, stressOn, skippingOn } = this.state;
    const osc = this.audioContext.createOscillator();
    const audioContainer = this.audioContext.createGain();
    osc.frequency.value = currentBeat === 1 && stressOn ? 800 : 500;
    this.skip
      ? (audioContainer.gain.value = 0)
      : (audioContainer.gain.value = 0.3);

    osc.connect(audioContainer);
    audioContainer.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.05);

    let secondsPerBeat = 60 / tempo;
    this.nextNoteTime += secondsPerBeat;

    let nextBeat = currentBeat + 1;
    if (nextBeat > beatCount) nextBeat = 1;
    this.setState({ prevBeat: currentBeat });
    this.setState({ currentBeat: nextBeat });

    if (skippingOn && currentBeat === beatCount) this.skip = !this.skip;
    else if (!skippingOn && this.skip && currentBeat === beatCount)
      this.skip = false;
  };

  scheduler = () => {
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.schedule(this.nextNoteTime);
    }
  };

  playSound = () => {
    if (this.audioContext == null)
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

    this.nextNoteTime = this.audioContext.currentTime + 0.05;
    this.interval = setInterval(() => this.scheduler(), 25);
  };

  stopSound = () => {
    clearInterval(this.intervalVisual);
    clearInterval(this.interval);
    this.interval = null;
  };

  tapTempo = () => {
    const { tempo, prevClick } = this.state;
    let state = { ...this.state };
    let click = new Date().getTime();
    let tapTempo = tempo;
    if (prevClick) {
      tapTempo = Math.round((1 / ((click - prevClick) / 1000)) * 60);
    }

    this.setState({ prevClick: click });
    if (this.checkRange(this.min, this.max, tapTempo)) {
      this.setState({ tempo: tapTempo });
      this.setState({ err: "" });
    } else
      this.setState({
        err: `Please tap with a frequency between ${this.min}-${this.max}bpm`,
      });
  };

  checkRange = (min, max, val) => val >= min && val <= max;

  toggleTheme = () => {
    let isLightTheme = this.state.isLightTheme === "true";

    if (this.state.isLightTheme === null)
      localStorage.setItem("isLightTheme", true);
    else localStorage.setItem("isLightTheme", !isLightTheme);

    this.setState({ isLightTheme: localStorage.getItem("isLightTheme") });
  };

  updateTheme = () => {
    let isLightTheme = this.state.isLightTheme === "true";

    document.body.classList.remove(!isLightTheme ? "light" : "dark");
    document.body.classList.add(isLightTheme ? "light" : "dark");
  };

  render() {
    let {
      isPlaying,
      beatCount,
      prevBeat,
      tempo,
      err,
      isCollapsed,
      stressOn,
      skippingOn,
      isLightTheme,
    } = this.state;
    this.updateTheme();
    return (
      <div className="app-container">
        <div className="navbar">
          <p>metronome.</p>
          <button
            className={
              "theme " +
              (isLightTheme === "false" || !isLightTheme ? "sun" : "moon")
            }
            onClick={() => this.toggleTheme()}
          />
        </div>
        <MetronomeCounter
          prevBeat={prevBeat}
          beatCount={beatCount}
          onClick={(newVal) => {
            this.checkRange(2, 12, newVal) &&
              this.setState({ beatCount: newVal });
          }}
        />
        <button
          onClick={() => {
            !isPlaying ? this.playSound() : this.stopSound();
            this.setState({ isPlaying: !isPlaying });
          }}
          className={"controller " + (isPlaying ? "pause" : "play")}
        />

        <div className="tempo-container">
          <h1>
            {tempo}
            <span>BPM</span>
          </h1>
          <Slider
            value={tempo}
            min={this.min}
            max={this.max}
            inc={this.inc}
            onChange={(e) => this.setState({ tempo: parseInt(e.target.value) })}
            onClick={(newVal) =>
              this.checkRange(this.min, this.max, newVal) &&
              this.setState({ tempo: newVal })
            }
          />
          <TempoMarking tempo={tempo} />
          <button className="tap" onClick={this.tapTempo}>
            TAP
          </button>
          {err && <span>{err}</span>}
        </div>
        <div className="settings-container">
          <div className="settings-button">
            <h3 onClick={() => this.setState({ isCollapsed: !isCollapsed })}>
              Additional Settings
            </h3>
            <button
              className={"collapse " + (isCollapsed ? "" : "active")}
              onClick={() => this.setState({ isCollapsed: !isCollapsed })}
            />
          </div>
          {!isCollapsed && (
            <div className="checkboxes">
              <CheckBoxInput
                value={stressOn}
                onClick={() =>
                  this.setState({ stressOn: !this.state.stressOn })
                }
                label="Stress first beat"
              />
              <CheckBoxInput
                value={skippingOn}
                onClick={() =>
                  this.setState({ skippingOn: !this.state.skippingOn })
                }
                label="Play 1 bar and mute 1 bar"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Metronome;
