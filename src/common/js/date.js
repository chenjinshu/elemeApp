function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDay(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let key in o) {
    if (new RegExp('(' + key + ')').test(fmt)) {
      let str = o[key] + '';
      fmt = fmt.replace(RegExp.$1, str.length === 1 ? ('0' + str) : str);
    }
  }
  return fmt;
}

export {
  formatDate
};
