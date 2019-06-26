export const getParame = (urlCode) => {
  var reg = new RegExp("(^|&)" + urlCode + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
  var context = "";
  if (r != null) context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined"
    ? null
    : context;
}
