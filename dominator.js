/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
	
	let documentReady = false;
	let funcArr = [];
	
	window.$d = (selector) => {
	  let node;
	  if (selector instanceof HTMLElement) {
	    node = new DOMNodeCollection([selector]);
	    return node;
	  } else if (typeof selector === 'string') {
	    let nodeList = document.querySelectorAll(selector);
	    let nodeListArray = Array.from(nodeList);
	    node = new DOMNodeCollection(nodeListArray);
	    return node;
	  } else if (typeof selector === 'function') {
	    documentReady ? selector() : funcArr.push(selector);
	  }
	};
	
	document.addEventListener('DOMContentLoaded', () => {
	  documentReady = true;
	  funcArr.forEach( func => func() );
	});
	
	$d.extend = (mainObj, ...otherObjs) => {
	  return Object.assign(mainObj, ...otherObjs);
	};
	
	$d.ajax = (options) => {
	  const defaults = {
	    method: 'GET',
	    url: "",
	    success: () => {},
	    error: console.log,
	    data: {},
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
	  };
	
	  options = $d.extend(defaults, options);
	  const xhr = new XMLHttpRequest();
	  xhr.open(options.method, options.url);
	  xhr.onload = () => {
	    if (xhr.status === 200) {
	      options.success(xhr.response);
	    }
	    else {
	      options.error(xhr.response);
	    }
	  };
	
	  xhr.send(JSON.stringify(options.data));
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(HTMLElements) {
	    this.HTMLElements = HTMLElements;
	  }
	
	  html(string) {
	    if(string){
	      this.HTMLElements.forEach(htmlElement => {
	        htmlElement.innerHTML = string;
	      });
	    } else {
	      return this.HTMLElements[0].innerHTML;
	    }
	  }
	
	  empty() {
	    this.HTMLElements.forEach(htmlElement => {
	      htmlElement.innerHTML = "";
	    });
	  }
	
	  append(arg){
	    if (this.HTMLElements.length === 0) {
	      return;
	    }
	
	    if(typeof arg === 'object' && !(arg instanceof DOMNodeCollection)){
	      arg = $d(arg);
	    }
	
	    if(typeof arg === 'string') {
	      this.HTMLElements.forEach(htmlElement => {
	        htmlElement.innerHTML += arg;
	      });
	    }
	
	    if ( arg instanceof DOMNodeCollection ) {
	      this.HTMLElements.forEach(htmlElement => {
	        arg.HTMLElements.forEach( child => {
	          htmlElement.appendChild(child);
	        });
	      });
	    }
	    return this;
	  }
	
	  attr(attributeName, attributeVal){
	    if (typeof attributeVal === 'string') {
	      this.HTMLElements.forEach((element) => {
	        element.setAttribute(attributeName, attributeVal);
	      });
	    } else {
	      return this.HTMLElements[0].getAttribute(attributeName);
	    }
	  }
	
	  addClass(className) {
	    this.HTMLElements.forEach(element => {
	      element.classList.add(className);
	    });
	  }
	
	  removeClass(className){
	    this.HTMLElements.forEach(element => {
	      element.classList.remove(className);
	    });
	  }
	
	  toggleClass(toggleToClassName) {
	    this.HTMLElements.forEach(node => node.classList.toggle(toggleToClassName));
	  }
	
	  children() {
	    let childNodes = [];
	    this.HTMLElements.forEach(element => {
	      let childNodeList = element.children;
	      let childNodeListArray = Array.from(childNodeList);
	      childNodes = childNodes.concat(childNodeListArray);
	    });
	    return new DOMNodeCollection(childNodes);
	  }
	
	  parent() {
	    const parentNodes = [];
	    this.HTMLElements.forEach( element => {
	      let parent = element.parentNode;
	      if (!parent.visited) {
	        parentNodes.push(parent);
	        parent.visited = true;
	      }
	    });
	    parentNodes.forEach(node => {node.visited = false;});
	    return new DOMNodeCollection(parentNodes);
	  }
	
	  find(selector) {
	    let foundNodes = [];
	    this.HTMLElements.forEach(node => {
	     const nodeList = node.querySelectorAll(selector);
	     foundNodes = foundNodes.concat(Array.from(nodeList));
	    });
	   return new DOMNodeCollection(foundNodes);
	  }
	
	  remove() {
	    this.HTMLElements.forEach(node => {
	      node.parentNode.removeChild(node);
	      this.HTMLElements = [];
	    });
	  }
	
	  on(eventName, callback) {
	    this.HTMLElements.forEach(node => {
	      node.addEventListener(eventName, callback);
	      const eventKey = `dominator-${eventName}`;
	      if (node[eventKey] === undefined) {
	        node[eventKey] = [];
	      }
	      node[eventKey].push(callback);
	    });
	  }
	
	  off(eventName) {
	    this.HTMLElements.forEach(node => {
	      const eventKey = `dominator-${eventName}`;
	      if (node[eventKey]) {
	        node[eventKey].forEach(callback => {
	          node.removeEventListener(eventName, callback);
	        });
	      }
	      node[eventKey] = [];
	    });
	  }
	}
	
	
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=dominator.js.map