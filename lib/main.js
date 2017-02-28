const DOMNodeCollection = require('./dom_node_collection.js');

const $d = (selector) => {
  let node;
  if (selector instanceof HTMLElement) {
    node = new DOMNodeCollection([selector]);
    return node;
  } else if (typeof selector === 'string') {
    let nodeList = document.querySelectorAll(selector);
    let nodeListArray = Array.from(nodeList);
    node = new DOMNodeCollection(nodeListArray);
    return node;
  }
};

window.$d = $d;
