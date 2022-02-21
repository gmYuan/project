import {Router,Route,Redirect} from 'dva/router';
import React from 'react';
//import dynamic from 'dva/dynamic';
export function renderAllRoutes(routesConfig,app){
   let routes = renderRoutes(routesConfig,app);
   let redirect = renderRedirect(routesConfig);
   return [...routes,redirect];
}
function dynamic({app,models,component}){
   return class extends React.Component{
      state={Component:null}
      componentDidMount(){
          this.setState({Component:()=><>加载中</>});
         Promise.all([
             Promise.all(models().map(item=>item())),
            component()
         ]).then(([models,Component])=>{//[ {namespace: 'home',state: {title:'我是首页'},};]
            console.log(app);
            models.forEach(model=>{
               let finded = app._models.find(item=>item.namespace === model.default.namespace);
               if(!finded)
                  app.model(model.default||model)
            });
            this.setState({Component});
         })
      }
      render(){
         let Component = this.state.Component;
         return Component&&<Component {...this.props}/>
      }
   }
}
export function renderRoutes(routesConfig,app){
   return routesConfig.map(({path,component:getComponent,routes=[],models=[]},index)=>{
      return (
          <Route 
          key={index} 
          path={path} 
          component={
             dynamic({
                app,
                models:()=>models||[],
                component:()=>{
                   return getComponent().then(result=>{
                      let Component = result.default||result;
                      return props=><Component {...props} routes={routes} app={app}/>
                   });
                }
             })
          }
          />
      )
   });
}

export function renderRedirect(routes){
  let {path} = routes.find(route=>route.redirect)||routes[0];
  return <Redirect to={path}/>
}