import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';

const Router = DefaultRouter;

const routes = [
  {
    path: '/',
    component: require('../../layouts/index.js').default,
    routes: [
      {
        path: '/',
        exact: true,
        component: require('../index.js').default,
      },
      {
        path: '/login',
        exact: true,
        component: require('../login.js').default,
      },
      {
        path: '/profile',
        exact: true,
        component: require('../profile.js').default,
        title: '个人中心',
        Routes: [require('../../PrivateRoute.js').default],
      },
      {
        path: '/user',
        exact: false,
        component: require('../user/_layout.js').default,
        routes: [
          {
            path: '/user/add',
            exact: true,
            component: require('../user/add.js').default,
          },
          {
            path: '/user/detail/:id',
            exact: true,
            component: require('../user/detail/$id.js').default,
          },
          {
            path: '/user/list',
            exact: true,
            component: require('../user/list.js').default,
          },
          {
            component: () =>
              React.createElement(
                require('C:/vipdata/vipproject/2019projects/11.umi/node_modules/_umi-build-dev@1.10.17@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'pages', hasRoutesInConfig: false },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('C:/vipdata/vipproject/2019projects/11.umi/node_modules/_umi-build-dev@1.10.17@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'pages', hasRoutesInConfig: false },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('C:/vipdata/vipproject/2019projects/11.umi/node_modules/_umi-build-dev@1.10.17@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'pages', hasRoutesInConfig: false },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen = () => {};

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
