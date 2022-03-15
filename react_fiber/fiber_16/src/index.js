import React from './react';
import ReactDOM from './react-dom';

// 03 生成渲染
let style = { border: '3px solid red', margin: '5px' }

let element3 = (
  <div id = 'A1' style={style}>
    A1
    <div id = 'B1' style={style}>
      B1
      <div id = 'C1' style={style}>C1</div>
      <div id = 'C2' style={style}>C2</div>
    </div>

    <div id = 'B2' style={style} >
      B2  
    </div>
  </div>
)

// 04 更新实现



ReactDOM.render(element3, document.getElementById('root'));