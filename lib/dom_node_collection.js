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
