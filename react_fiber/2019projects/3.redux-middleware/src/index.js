import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import {Provider} from './react-redux';
import {store,persistor} from './store';
import {PersistGate} from './redux-persist/integration/react';
class Main extends React.Component{
    state = {show:true}
    render(){
        return (
            <div>
            <button onClick={()=>this.setState({show:false})}>+</button>
            {
                this.state.show&&(
                     <PersistGate persistor={persistor}>
                       <Counter/>
                    </PersistGate>
                )
            }
            </div>
           
        )
    }
}
ReactDOM.render(<Provider store={store}>
<Main/>
</Provider>,document.getElementById('root'));
