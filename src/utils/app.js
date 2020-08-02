//
import cookie from "cookie_js";

const adminToKen = "amdin_token";
const usernameKey = "username";

export function getToken(){
    return cookie.get(adminToKen);
}

export function setToken(toKen){
    return cookie.set(adminToKen,toKen);
}

export function removeToken(){
    return cookie.remove(adminToKen);
}

export function setUserName(value){
    return cookie.set(usernameKey,value);
}

export function getUserName(value){
    return cookie.get(usernameKey);
}

export function removeUserName(){
    return cookie.remove(usernameKey);
}