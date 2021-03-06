import React from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

class Route  extends React.Component{
  static contextType = RouterContext
  
  render(){
      let { history, location} = this.context
      let {component: RouteComponent, computedMatch, render, children} = this.props
      // debugger
      const match = computedMatch?computedMatch : matchPath(location.pathname,this.props);

      let routeProps = { history, location }
      let renderElement = null
      if (match) {
        routeProps.match = match

        if (RouteComponent) {  //如果传递了 component属性，优先渲染component
          renderElement = <RouteComponent {...routeProps}/>
        } else if (render) {
          renderElement = render(routeProps)
        } else if (children) {
          renderElement = children(routeProps)
        } else {
          renderElement=null
        } 
      } else {
        if (children) {
          renderElement=children(routeProps)
        } else {
          renderElement=null
        }
    }

    return renderElement
  }
}

export default Route;