import "./news.css"
import { Component } from "react"

export default class _news_review_ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: props.comment
        }
    }
    render() {
        return(
            <div>
                <p>{this.state.comment}</p>
            </div>
        );
    }
}

export class _news_review_c extends Component {
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
            </div>
        );
    }
}

export class _news_review_e extends Component {
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
            </div>
        );
    }
}