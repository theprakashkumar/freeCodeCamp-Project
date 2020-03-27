class App extends React.Component{
    constructor(props){
        super(props);
        this.state={quote:'', by:''};
        this.loadNewOne=this.loadNewOne.bind(this);
    }
    componentDidMount(){
        this.loadNewOne()
    }
    //Get a new quote.
    async loadNewOne(){
        const apiUrl="http://quotes.stormconsultancy.co.uk/random.json";
        let response= await fetch(apiUrl).then(res => res.json()).then(data => data);
        console.log(response)
        this.setState({quote: response.quote, by: response.author})
    }
    render(){
    return(
        // User Story #1
        <div id='quote-box'>
            <QuoteAuthor quote={this.state.quote} author={this.state.by}/>
            <Buttons fun={this.loadNewOne} id={'new-quote'} buttonText={'New Quote'}/>
            <a class="twitter-share-button" href={`https://twitter.com/intent/tweet?text=${this.state.quote}`} hashtags='this'>
                Tweet
            </a>
        </div>
    )
    }
}
//Component to render Quote and Author.
const QuoteAuthor=(props) => {
        return(
            <div>
                <p id='text'>{props.quote}</p>
                <br/>
                <p id='author'>{`- ${props.author}`}</p>
            </div>
        )
}
//Component to render button
class Buttons extends React.Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this);
    }
    handleClick(){
        this.props.fun();
    }
    render(){
        return(
            <button id={this.props.id} onClick={this.handleClick}>{this.props.buttonText}</button>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));