import React, { useState, useRef, useEffect } from 'react'

function App() {
  return (
    <div id='parent'>
      <div id='child1'>
        <section id='child1-1'>child1-1</section>
        <section id='child1-2'>child1-2</section>
      </div>
      <div id='child2'>child2</div>
    </div>
  )
}

// 想要调试那个功能，就替换下面的组件
export default App;
