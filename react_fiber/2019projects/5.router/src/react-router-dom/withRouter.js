import React from 'react';
import Route from './Route';
export default function withRouter(Component){
   return props=><Route component={Component}/>
}