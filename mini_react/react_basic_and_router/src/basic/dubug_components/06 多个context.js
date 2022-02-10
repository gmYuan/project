import React from './react';
import ReactDOM from './react-dom';

let GrandFatherContext = React.createContext()
let FatherContext = React.createContext()
class Son extends React.Component {
  render() {
    return (
      <GrandFatherContext.Consumer>
        {
          grandFatherValue=>{
            return (
              <FatherContext.Consumer>
                {
                  fatherValue=>{
                    return <div>{grandFatherValue.name}:{fatherValue.age}</div>
                  }
                }
              </FatherContext.Consumer>
            )
          }
        }
      </GrandFatherContext.Consumer>
    )
  }
}
class Father extends React.Component {
  render() {
    let fatherValue = { age:12 };
    return (
      <FatherContext.Provider value={fatherValue}>
        <div style={{ margin: '10px', border: `5px solid red`, padding: '5px' }}>
          <Son/>
        </div>
      </FatherContext.Provider>
    )
  }
}
class GrandFather extends React.Component {
  render() {
    let grandFatherValue = { name:'grandFather' };
    return (
      <GrandFatherContext.Provider value={grandFatherValue}>
        <div style={{ margin: '10px', border: `5px solid red`, padding: '5px', width: '200px' }}>
          <Father/>
        </div>
      </GrandFatherContext.Provider>
    )
  }
}

const element10 = <GrandFather />