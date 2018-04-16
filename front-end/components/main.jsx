import React from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import ReactNotify from 'react-notify';
import StateApi from 'utilities/stateApi';
import Home from 'components/pages/home.jsx'

export default class Main extends React.Component {
    static childContextTypes = {
        store: PropTypes.object
    };

    getChildContext() {
        return {
            store: new StateApi(this)
        };
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/" component={Home} />
                </Switch>
                <ReactNotify ref="notifier" successText="Success" errorText="Error" infoText="Info" />
            </div>
        );
    }
}
