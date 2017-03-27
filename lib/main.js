const DOMNodeCollection = require('./dom_node_collection.js');

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
