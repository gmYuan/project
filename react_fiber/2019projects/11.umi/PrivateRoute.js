//<PrivateRoute path="/profile" component={Profile}/>
import {Route,Redirect} from 'react-router-dom';

export default ({render,...rest})=>{
    console.log('rest1',render,rest)
    //return <Route {...rest} render={props=>{
    //    return localStorage.getItem('login')?render(props):<Redirect to={{pathname:'/login',state:{from:props.location.pathname}}}/>
    //}}/>
     return localStorage.getItem('login')?render(rest):<Redirect to={{pathname:'/login',state:{from:props.location.pathname}}}/>
}