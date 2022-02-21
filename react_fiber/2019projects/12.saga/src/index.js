import store from './store';
import Login from './components/Login';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
ReactDOM.render(
    <Provider store={store}>
        <Login/>
    </Provider>,
    document.getElementById('root')
);