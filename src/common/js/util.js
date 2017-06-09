/**
 * 解析URL参数
 *@example ?id=cjs&a=b
 * @return Object { id:'cjs', a:'b' }
 */

function urlParse() {
  let url = window.location.search;        //  获取url参数字符串
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  let obj = {};
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = window.decodeURIComponent(tempArr[0]);
      let val = window.decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

export {
  urlParse
};
