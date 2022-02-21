import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Counter from './components/Counter';
import {Route,Link} from 'react-router-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import {ConnectedRouter} from './connected-react-router';
import history from './history';
import store from './store';
ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <>
                <Route path="/" exact={true} component={Home}/>
                <Route path="/counter" component={Counter}/>
            </>
        </ConnectedRouter>
    </Provider>
   
), document.getElementById('root'));