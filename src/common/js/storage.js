function saveToLocalStorage(id, key, val) {
  let seller = window.localStorage.getItem('__seller__');
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);    // localStorage都是以字符串形式存储的，所以需要用这个将其转化为JSON对象
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  window.localStorage.setItem('__seller__', JSON.stringify(seller));
}

function readFromLocalStorage(id, key, def) {                 // def为默认值
  let seller = window.localStorage.getItem('__seller__');
  if (!seller) {
    return def;
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      return def;
    } else {
      return seller[id][key] || def;
    }
  }
}

export {
  saveToLocalStorage,
  readFromLocalStorage
};
