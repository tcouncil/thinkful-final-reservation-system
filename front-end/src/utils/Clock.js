import React from 'react';
import moment from 'moment';

export default class Clock extends React.Component {
    constructor() {
        super()
        this.state = {
            time: moment().format('LTS'),
            one: true,
            two: false,
            three: false,
            four: false,
            class: ''
        }
    }
    componentDidMount() {
        setInterval(() => {
            if (this.state.one === true) {
                this.setState({
                    time: moment().format('LTS')
                })
            }
            else if (this.state.four === true) {
                this.setState({
                    time: moment().format('LT')
                })
            }
        }, 1000)
    }
    
    render() {
        return (
            <div id="clock" style={this.state.background} onClick={this.clicked}>
                <h4 className={this.state.class}>{this.state.time}</h4>
            </div>
        )
    }
}

