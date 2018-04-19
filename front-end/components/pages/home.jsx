import React from 'react';
import PropTypes from 'prop-types';

require('./home.css');
export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
        this.store = context.store;
        this.clickHandler = this.clickHandler.bind(this);
    }

    async clickHandler(event) {
        let self = this;
        event.preventDefault();
        self.store.notify('info', 'This is info message alert....!');
    }

    style = {
        wrapper: {
            margin: 25
        },
        h2:{
            fontSize: 25,
            paddingBottom: 10
        }
    };

    render() {
        return <div style={this.style.wrapper}>
            <h2 style={this.style.h2}>Home page</h2>
            <div>
                <p>
                    This is home page.... click to <button onClick={this.clickHandler}>Show message</button>
                </p>

            </div>
        </div>;
    }
}

Home.contextTypes = {
    store: PropTypes.object
};