/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/global.css":
/*!****************************************************************************!*\
  !*** ./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/global.css ***!
  \****************************************************************************/
/***/ ((module) => {


         var list = [];
         list.toString = function(){return this.join('')}
         
         list.push(`body{
    background-color: green;
}`);
         module.exports = list;
      

/***/ }),

/***/ "./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/index.css":
/*!***************************************************************************!*\
  !*** ./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/index.css ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


         var list = [];
         list.toString = function(){return this.join('')}
         list.push(...__webpack_require__(/*! -!../loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./global.css */ "./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/global.css"));
         list.push(`body{
    color: red;
}

#root{
    background-image: url('`+__webpack_require__(/*! ./images/kf.jpg */ "./src/images/kf.jpg")+`');
    background-size: contain;
    width: 100px;
    height:100px;
}`);
         module.exports = list;
      

/***/ }),

/***/ "./loaders/style-loader.js!./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/index.css":
/*!*****************************************************************************************************!*\
  !*** ./loaders/style-loader.js!./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/index.css ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


     let style = document.createElement('style');
     style.innerHTML = (__webpack_require__(/*! !!../loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./index.css */ "./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/index.css").toString)();
     document.head.appendChild(style);
    

/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


        let result = __webpack_require__(/*! !!../loaders/style-loader.js!../loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./index.css */ "./loaders/style-loader.js!./loaders/css-loader.js??ruleSet[1].rules[0].use[2]!./src/index.css");
        if(result && result.__esModule){
            result = result.default;
        }
        if(typeof result === 'string'){
            module.exports = result;
        }else{
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./src/images/kf.jpg":
/*!***************************!*\
  !*** ./src/images/kf.jpg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "4a783413fe7beffd284711d5fdfd1549.jpg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const css = __webpack_require__(/*! ./index.css */ "./src/index.css");
console.log("css--", css);

})();

/******/ })()
;