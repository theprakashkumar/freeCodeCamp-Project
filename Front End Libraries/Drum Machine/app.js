class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
          heater: true, 
          displayText: "HEATER KIT", 
          drumOn: true, 
          volume: 50
        }
        this.handleKeyPress=this.handleKeyPress.bind(this);
        this.heaterOrPiano=this.heaterOrPiano.bind(this);
        this.myPlayAudio=[];
        this.toggleDrum=this.toggleDrum.bind(this);
        this.toggleToHeater=this.toggleToHeater.bind(this);
        this.toggleToPiano=this.toggleToPiano.bind(this);
        this.volumeChange=this.volumeChange.bind(this);
    }

    // Toggle the drum on and off.
    toggleDrum(){
      this.setState(st => {
        return {drumOn: !st.drumOn}
      });
    }

    // Function to return the clickable items' text, sound source and text to display.
    heaterOrPiano(stat){
        if(stat){
            return [ 
              { letter: 'Q', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3', display: 'HEATER 1' },
              { letter: 'W', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3', display: 'HEATER 2' },
              { letter: 'E', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3', display: 'HEATER 3' },
              { letter: 'A', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3', display: 'HEATER 4' },
              { letter: 'S', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3', display: 'CLAP' },
              { letter: 'D', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3', display: 'OPEN HH' },
              { letter: 'Z', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3', display: 'KICK N\' HAT' },
              { letter: 'X', sound: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3', display: 'KICK' },
              { letter: 'C', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3', display: 'CLOSED HH' } 
              ];
            } else{
              return [ 
                { letter: 'Q', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3', display: 'CHOR 1' },
                { letter: 'W', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3', display: 'CHOR 2' },
                { letter: 'E', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3', display: 'CHOR 3' },
                { letter: 'A', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3', display: 'SHAKER' },
                { letter: 'S', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3', display: 'OPEN HH' },
                { letter: 'D', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3', display: 'CLOSED HH' },
                { letter: 'Z', sound: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3', display: 'PUNCHY KICK' },
                { letter: 'X', sound: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3', display: 'SIDE STICK' },
                { letter: 'C', sound: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3', display: 'SNARE' } ]
          }
    }
    
    // Calling `clicked` by provide required `index` and `text`.
    // Changing the background color of pressed div and color of corresponding text.
    handleKeyPress = (event) => {
      let keyCodes=[81, 87, 69, 65, 83, 68, 90, 88, 67];
      if(this.state.drumOn && keyCodes.includes(event.keyCode)){
        let indexAndTextHeater=[ 
          { index: 0, text: 'HEATER 1', letter: 'Q'},
          { index: 1, text: 'HEATER 2', letter: 'W'},
          { index: 2, text: 'HEATER 3', letter: 'E'},
          { index: 3, text: 'HEATER 4', letter: 'A'},
          { index: 4, text: 'CLAP', letter: 'S'},
          { index: 5, text: 'OPEN HH', letter: 'D'},
          { index: 6, text: 'KICK N\' HAT', letter: 'Z'},
          { index: 7, text: 'KICK', letter: 'X'},
          { index: 8, text: 'CLOSED HH', letter: 'C'} 
        ];
        let indexAndTextPiano=[ 
          { index: 0, text: 'CHOR 1', letter: 'Q'},
          { index: 1, text: 'CHOR 2', letter: 'W'},
          { index: 2, text: 'CHOR 3', letter: 'E'},
          { index: 3, text: 'SHAKER', letter: 'A'},
          { index: 4, text: 'OPEN HH', letter: 'S'},
          { index: 5, text: 'CLOSED HH', letter: 'D'},
          { index: 6, text: 'PUNCHY KICK', letter: 'Z'},
          { index: 7, text: 'SIDE STICK', letter: 'X'},
          { index: 8, text: 'SNARE', letter: 'C'} 
        ];
        // Calling clicked.
        let indexAndText;
        this.state.heater ? indexAndText=indexAndTextHeater : indexAndText=indexAndTextPiano;
        let indexOfKey=keyCodes.indexOf(event.keyCode);
        this.clicked(indexAndText[indexOfKey].index, indexAndText[indexOfKey].text);
        // Changing the background of `.drum-pad` div.
        let selectedDiv=document.querySelector(`div#${indexAndText[indexOfKey].letter}`);
        selectedDiv.classList.add("selected-drum-pad");
        setInterval(() => {selectedDiv.classList.remove("selected-drum-pad"); }, 100);
        // Changing the color of `.drum-text` span.
        let selectedText=document.querySelector(`span#${indexAndText[indexOfKey].letter}`);
        selectedText.classList.add("selected-drum-text");
        setInterval(() => {selectedText.classList.remove("selected-drum-text"); }, 100);
      } else if(!this.state.drumOn && keyCodes.includes(event.keyCode)){
        alert("Turn On, Please");
      }
    }
  
    // Play the audio using ref.
    // Change text on display.
    // Changing the volume according to volume slider.
    clicked(index, text, letter){
      if(this.state.drumOn){
        this.myPlayAudio[index].volume=this.state.volume*0.01;
        this.myPlayAudio[index].play();
        this.setState({displayText: text});
      }else if(!this.state.drumOn){
        alert("Turn On, Please");
      }   
    }

    // Change the current instrument to Heater(i.e. change the state heater `true`).
    toggleToHeater(){
      this.setState({heater: true, displayText: "HEATER KIT"});
    }

    // Change the current instrument to Piano(i.e. change the state heater `false`).
    toggleToPiano(){
      this.setState({heater: false, displayText: "PIANO KIT"});
    }

    // Change the volume.
    volumeChange(event){
      this.setState({volume: event.target.value});
    }

    //Add event listener to all clickable button when first component loads.
    componentDidMount(){
        document.addEventListener("keydown", this.handleKeyPress, true);
    }

    render(){
        let pads=this.heaterOrPiano(this.state.heater);
        return(
          <div id="App">
            <div id="drum-machine">
              {pads.map((pad, index) => (
                  <DrumPadForwardRef 
                    key={index} 
                    ref={playAudio => this.myPlayAudio[index]=playAudio} 
                    id={pad.letter} 
                    innerText={pad.letter} 
                    clicked={() => this.clicked(index, pad.display)} 
                    soundSource={pad.sound}
                  />
                )
              )}
            </div>
            <div id="right-controls">
              <div id="display">{this.state.displayText}</div>
              <div id="controls-button">
                  <i onClick={this.toggleDrum} className="fas fa-power-off fa-2x" id="power" style={{color: this.state.drumOn ? "rgb(149, 210, 236)" : "black"}}></i>
                  <i onClick={this.toggleToHeater} className="fas fa-h-square fa-2x" style={{color: this.state.heater ? "rgb(149, 210, 236)" : "black"}}></i>
                  <i onClick={this.toggleToPiano}className="fas fa-parking fa-2x" style={{color: this.state.heater ? "black" :"rgb(149, 210, 236)"}}></i>
              </div>
              <div id="volume-slider">
                <input type="range" name="points" min="0" max="100" step="1" value={this.state.volume} onChange={this.volumeChange}/>
                <span id="volume-text">{this.state.volume}</span>
              </div>
            </div>
          </div> 
        )
    }
}

class DrumPad extends React.Component{
    render() {
        return (
            <div onClick={() => this.props.clicked()} className="drum-pad" id={this.props.innerText}>
                <span className="drum-text" id={this.props.innerText}>{this.props.innerText}</span>
                <audio className="clip" id={this.props.innerText} ref={this.props.innerRef} src={this.props.soundSource}></audio>
            </div>
        );
    }
}

const DrumPadForwardRef=React.forwardRef((props, ref) => <DrumPad innerRef={ref} {...props} />);

ReactDOM.render(<App/>, document.getElementById('root'));