import "./news.css"
import _news_review_, { _news_review_c, _news_review_e } from "./_news_review_"
import { Component } from "react"

export default class _news_ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            description: props.description
        }
    }
    render() {
        return(
            <div>
                <h1>{this.state.title}</h1>
                <p>{this.state.description}</p>
                <_news_review_
                    comment="some comment"
                />
            </div>
        );
    }
}

export class _news_c extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: undefined,
            description: undefined
        }
    }
    render() {
        return(
            <div>
                <label for='title'>TITLE</label>
                <input
                    id='title'
                    type='text'
                    onChange={(event) => this.setState({title: event.target.value})}
                />
                <label for='description'>DESCRIPTION</label>
                <input
                    id='description'
                    type='text'
                    onChange={(event) => this.setState({description: event.target.value})}
                />
                <input
                    id='submit'
                    type='button'
                    value = 'Submit'
                    onChange={(event) => this.setState({description: event.target.value})}
                />
            </div>
        );
    }
}

export class _news_e extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            description: props.description
        }
    }
    render() {
        return(
            <div>
                <label for='title'>TITLE</label>
                <input
                    id='title'
                    type='text'
                    onChange={(event) => this.setState({title: event.target.value})}
                    value={this.state.title}
                />
                <label for='description'>DESCRIPTION</label>
                <input
                    id='description'
                    type='text'
                    onChange={(event) => this.setState({description: event.target.value})}
                    value={this.state.description}
                />
                <input
                    id='submit'
                    type='button'
                    value = 'Submit'
                    onChange={(event) => this.setState({description: event.target.value})}
                />
            </div>
        );
    }
}