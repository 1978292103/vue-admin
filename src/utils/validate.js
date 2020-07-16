/**
 * 过滤特殊字符
 */

export function stripscript(str) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？%]")
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '');
  }
  return rs;
}
/** 
 * 验证邮箱
 */
export function validateEmail(value) {
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if(!reg.test(value)){
        return true;
    }else{
        return false;
    }
}
/**
 * 验证密码
 *  */   
export function validatePwd(value){
    let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,20})$/;
    return !reg.test(value) ? true : false;
} 
/**
 * 验证码的效验
 */
export function validateVCode(value){
    let reg = /^[0-z0-9]{6}$/
    return !reg.test(value) ? true : false;
} 