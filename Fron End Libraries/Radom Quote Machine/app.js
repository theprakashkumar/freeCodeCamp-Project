// For some reason on CodePen emoji icon is not working(line no 23) so over there is am using:<img src="https://emoji-css.afeld.me/emoji/v.png" id="peace"/>
class App extends React.Component{
    constructor(props){
        super(props);
        this.state={quote:'', by:'', loading: true};
        this.loadNewOne=this.loadNewOne.bind(this);
    }
    componentDidMount(){
        this.loadNewOne()
    }
    //Get a new quote.
    async loadNewOne(){
        const apiUrl="https://cors-anywhere.herokuapp.com/"+"https://opinionated-quotes-api.gigalixirapp.com/v1/quotes";
        this.setState({loading: true});
        let response= await fetch(apiUrl).then(res => res.json()).then(data => data).catch(function() {
            console.log("error");
        });
        if(!response.quotes[0].author) response.quotes[0].author="Unknown";
        this.setState({quote: response.quotes[0].quote, by: response.quotes[0].author, loading: false});
    }
    render(){
    return(
        <div>
            {this.state.loading ? <div id="peace-container"><i className="em em-v" ariarole="presentation" aria-label="VICTORY HAND" id="peace"></i></div> : (
                <div id='quote-box'>
                    <QuoteAuthor quote={this.state.quote} author={this.state.by}/>
                    <a id='tweet-quote' className="twitter-share-button" href={`https://twitter.com/intent/tweet?text=${this.state.quote}&hashtags=quote`}>
                        <i className="fab fa-twitter fa-lg"></i>
                    </a>
                    <a href={`https://api.whatsapp.com/send?text=${this.state.quote}`}><i className="fab fa-whatsapp fa-lg"></i></a>
                    <button id='new-quote' onClick={this.loadNewOne}>New Quote</button>
                </div>
            )}
        </div>
    )
    }
}
//Component to render Quote and Author.
const QuoteAuthor=(props) => {
        return(
            <div>
                <p id='text'>{props.quote}</p>
                <p id='author'>{`- ${props.author}`}</p>
            </div>
        )
}

ReactDOM.render(<App/>, document.getElementById("root"));