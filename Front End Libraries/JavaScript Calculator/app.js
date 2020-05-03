class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      display: "",
      finalResult: "",
      operation: ""
    }
    this.addZeroToDisplay=this.addZeroToDisplay.bind(this);
    this.dot=this.dot.bind(this);
    this.backSpace=this.backSpace.bind(this);
    this.addition=this.addition.bind(this);
    this.subtraction=this.subtraction.bind(this);
    this.multiplication=this.multiplication.bind(this);
    this.division=this.division.bind(this);
    this.percentage=this.percentage.bind(this);
    this.equate=this.equate.bind(this);
    this.final=this.final.bind(this);
    this.reset=this.reset.bind(this);
  }

  // Update number on the display.
  updateDisplay(num){
    let {operation, display, finalResult}=this.state;
    if(operation=="" && finalResult!==""){
      this.setState(st => ({finalResult: "", display: st.display+num}));
    }else if(display.length<13){
      this.setState(st => ({display: st.display+num}));
    }else{
      console.log("Digit Limit Met");
    }
  }

  // Update display with zero.
  addZeroToDisplay(){
    if(this.state.display.length<13){
      if(this.state.display!=="0"){
      this.setState(st => ({display: st.display+"0"}));
      }
    }else{
      console.log("Digit Limit Met");
    }
  }

  // Add dot to display.
  dot(){
    if(this.state.display==""){
      this.setState({display: "0."});
    }else if(this.state.display.indexOf(".")==-1){
      this.setState(st => ({display: st.display+"."}))
    }
  }

  // Clear last number from display.
  backSpace(){
    if(this.state.display){
      this.setState(st => ({display: st.display.slice(0, -1)}));
    }
  }

  // ADDITION
  addition(symbol){
    let {display, finalResult, operation}=this.state;
    // Initial state.
    if(operation=="" && finalResult==""){
      this.setState({finalResult: display, display: "", operation: "+"});
    // Handle sum of positive and negative number.
    }else if(display=="" || display=="-"){
      this.setState({operation: "+", display: ""});
    }else{
      this.equate();
      this.setState({operation: "+"});
    }
  }

  // SUBTRACTION
  subtraction(){
    let {display, finalResult, operation}=this.state;
    // Initial state and we got started with a negative number.
    if(display=="" && operation=="" && finalResult==""){
      this.setState({display: "-"});
    // Initial state and we got started with a positive number.
    }else if(operation=="" && finalResult==""){
      this.setState({finalResult: display, display: "", operation:"-"});
    // Handle multiplication and division of a number with negative number.
    }else if((operation=="/" || operation=="*") && display==""){
      this.setState({display: "-"})
    }else {
      let calculated=Number(finalResult)-Number(display);
      this.equate(); 
      this.setState({operation: "-"})
    }
  }

  // MULTIPLICATION
  multiplication(){
    let {display, finalResult, operation}=this.state;
    // Initial state
    if(operation=="" && display!=="" && finalResult==""){
      this.setState(st => {
        return  {finalResult: st.display, display: "", operation: "*"}
      });
    // Not initial state but when users press * button more than once
    }else if(display==""){
      this.setState({operation: "*"});
    // Not initial state i.e. some operation may already have been done. 
    }else if(display!==""){
      this.equate(); 
      this.setState({operation: "*"});
    }
  }

  // DIVISION
  division(){
    let {display, finalResult, operation}=this.state;
    // Initial state
    if(operation=="" && display!=="" && finalResult==""){
      this.setState(st => {
        return  {finalResult: st.display, display: "", operation: "/"}
      });
    // Not initial state i.e. some operation may already have been done. 
    }else if(display==""){
      this.setState({operation: "/"});
    // Not initial state but when users press * button more than once
    }else if(display!==""){
      this.equate();
      this.setState({operation: "/"})
    }
  }

  // PERCENTAGE
  percentage(){
    if(this.state.operation=="*"){
      let calculated=Number(this.state.finalResult)*Number(this.state.display)/100;
      this.setState({finalResult: calculated, display: "", operation: "*"});
    }
  }

  // Calculate the last operation.
  equate(){
    let {display, finalResult, operation}=this.state;
    if(operation=="+"){
      let calculated=Number(finalResult)+Number(display);
      this.setState({display: "", finalResult: calculated});
    }else if(operation=="-"){
      let calculated=Number(finalResult)-Number(display);
      this.setState({display: "", finalResult: calculated});
    }if(operation=="*"){
      let calculated=Number(finalResult)*Number(display);
      this.setState({display: "", finalResult: calculated});
    }if(operation=="/"){
      let calculated=Number(finalResult)/Number(display);
      this.setState({display: "", finalResult: calculated});
    }
  }

  // Handle = button, to give final result.
  final(){
    this.equate();
    this.setState({operation: "", operation: ""})
  }

  // Reset calculator
  reset(){
    this.setState({display: "", finalResult: 0, operation: ""});
  }

  render(){
    let firstRowNum=[
      {number: 7, id: "seven"},
      {number: 8, id: "eight"},
      {number: 9, id: "nine"},
    ];
    let secondRowNum=[
      {number: 4, id: "four"},
      {number: 5, id: "five"},
      {number: 6, id: "six"},
    ];
    let thirdRowNum=[
      {number: 1, id: "one"},
      {number: 2, id: "two"},
      {number: 3, id: "three"},
    ];
    return(
      <div id="app">
        <div id="display"><span id="display-text">{this.state.display ? this.state.display: Number(this.state.finalResult)}</span></div>

        <div id="buttons">
          {/* First Row */}
          <div className="button" id="clear" onClick={this.reset}><span className="button-text">AC</span></div>
          <div className="button" id="backspace" onClick={this.backSpace}><span className="button-text">CE</span></div>
          <div className="button" id="percentage" onClick={this.percentage}><span className="button-text">%</span></div>
          <div className="button" id="divide" onClick={this.division}><span className="button-text">/</span></div>
          {/* Second Row */}
          {firstRowNum.map(num => <div className="button" key={num.number} id={num.id} onClick={() => this.updateDisplay(num.number)}><span className="button-text">{num.number}</span></div>)}
          <div className="button" id="multiply" onClick={this.multiplication}><span className="button-text">x</span></div>
          {/* Third Row */}
          {secondRowNum.map(num => <div className="button" key={num.number} id={num.id} onClick={() => this.updateDisplay(num.number)}><span className="button-text">{num.number}</span></div>)}
          <div className="button" id="subtract" onClick={this.subtraction}><span className="button-text">-</span></div>
          {/* Fourth Row */}
          {thirdRowNum.map(num => <div className="button" key={num.number} id={num.id} onClick={() => this.updateDisplay(num.number)}><span className="button-text">{num.number}</span></div>)}
          <div className="button" id="add" onClick={this.addition}><span className="button-text">+</span></div>
          {/* Fifth Row */}
          <div className="button" id="zero" onClick={this.addZeroToDisplay}><span className="button-text">0</span></div>
          <div className="button" id="decimal" onClick={this.dot}><span className="button-text">.</span></div>
          <div className="button" id="equals" onClick={this.final}><span className="button-text">=</span></div>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));
