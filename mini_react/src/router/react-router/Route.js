import React from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

class Route  extends React.Component{
  static contextType = RouterContext
  
  render(){
      let { history, location} = this.context
      let {component: RouteComponent, path, computedMatch, render, children} = this.props
      // debugger
      const match = matchPath( location.pathname, this.props)

      let routeProps = { history, location }
      let renderElement = null
      if (match) {
        routeProps.match = match
        renderElement = <RouteComponent {...routeProps}  />
      }

      return renderElement
           
  
      // if(match){
      //   routeProps.match = match;
      //   if(RouteComponent){
      //     renderElement = <RouteComponent {...routeProps}/>;
      //   }else if(render){
      //     renderElement = render(routeProps);
      //   }else if(children){
      //     renderElement = children(routeProps);
      //   }else{
      //     renderElement=null;
      //   }
      // }else{
      //   if(children){
      //     renderElement = children(routeProps);
      //   }else{
      //     renderElement=null;
      //   }
      // }
  }
}
export default Route;