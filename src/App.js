import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Tone from 'tone';
import PlayToggleButton from './components/PlayToggleButton';
var distortion = new Tone.Distortion(0.05);
var freeverb = new Tone.Freeverb().toMaster();
freeverb.dampening.value = 1000;
var autoFilter = new Tone.AutoFilter('1n').toMaster().start();
var autoPanner = new Tone.AutoPanner('1n').toMaster().start();

var synth = new Tone.AMSynth().connect(freeverb);
var tremolo = new Tone.Tremolo().start();

var synth = new Tone.FMSynth({
  oscillator: {
    type: 'square'
  },
  filter: {
    Q: 2,
    type: 'lowpass',
    rolloff: -12
  },
  envelope: {
    attack: 0.005,
    decay: 3,
    sustain: 0,
    release: 0.45
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.32,
    sustain: 0.9,
    release: 3,
    baseFrequency: 700,
    octaves: 2.3
  }
}).chain(distortion, freeverb, autoFilter, autoPanner, Tone.Master);

var synthB = new Tone.Synth({
  oscillator: {
    type: 'triangle8'
  },
  envelope: {
    attack: 2,
    decay: 1,
    sustain: 0.4,
    release: 4
  }
}).chain(distortion, freeverb, autoFilter, Tone.Master);

class App extends Component {
  constructor() {
    super();
    // Tone.Transport.schedule(this.triggerSynth, 0);
    // Tone.Transport.schedule(this.triggerSynth, '0:6');
    synthB.triggerAttackRelease('a2', '160', '5n');
    //set the transport to repeat
    Tone.Transport.loopEnd = '4m';
    Tone.Transport.loop = true;
    // Tone.Transport.start('+0.0');

    this.state = {
      playing: false,
      drone: true
    };
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  triggerSynth(note, length, time) {
    console.log('Trigger Synth', time);
    synth.triggerAttackRelease(note, length, time);
    // synth.triggerAttackRelease('E4', '8n', Tone.Time('4n') + Tone.Time('8n'));
    // synth.triggerAttackRelease('G4', '16n', '2n');
  }

  togglePlaying() {
    console.log('toggle playing');
    const rhubArr = ['F#3', 'A3', 'B3', 'C#4', 'E4', 'F#4'];

    rhubArr.map((note, index) => {
      let thisTime = this.getRandomInt(rhubArr.length);
      console.log('this time', thisTime);
      Tone.Transport.schedule(time => {
        this.triggerSynth(note, '2n', time);
      }, '0:' + thisTime);
    });

    if (this.state.playing) {
      this.setState({ playing: false });
      Tone.Transport.stop();
    } else {
      this.setState({ playing: true });
      Tone.Transport.start('+0.0');
    }
  }

  toggleDrone() {}

  render() {
    const notesArray = ['G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'];
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
          Tone.js
          <PlayToggleButton
            togglePlaying={this.togglePlaying.bind(this)}
            isPlaying={this.state.playing}
          />
          <div>Tone player</div>
          <button>Drone Toggle</button>
        </header>
      </div>
    );
  }
}

export default App;
