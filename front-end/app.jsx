import React from 'react';
import ReactDOM from 'react-dom';
import Main from 'components/main.jsx';
import {HashRouter} from 'react-router-dom';

ReactDOM.render(
    <HashRouter>
        <Main />
    </HashRouter>,
    document.getElementById('wrapper')
);
