import Cookies from "js-cookie";
import { getUser, handleCookie } from "./Users";
import jwt_decode from "jwt-decode";

export const handleMessage = (message) => {
    var msg = message;
    if(Array.isArray(message)){
        var i;
        msg = '';
        for(i = 0; i < message.length; i++){
            msg += message[i].msg+'<br/>';
        }
    }
    return msg;
}

export const getCookie = (name) => {
	var value = `; ${document.cookie}`;
	var parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const checkCookie = (cname) => {
    let cookie = getCookie(cname);
    if(cookie == "") return false;
    return true;
}

export const failMessage = (jqXHR) => {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'No connection.\n Verify Network.';
        //ERR_CONNECTION_REFUSED hits this one
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (jqXHR.status === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (jqXHR.status === 'timeout') {
        msg = 'Time out error.';
    } else if (jqXHR.status === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }
    return msg;
}

export const getPersonalInfo = async() => {
    const user = await getUser(Cookies.get('userId'));
    if(user.is_error == true){
        if(user.message == 'Unauthorized' 
          || user.message == 'Token kosong'
          || user.message == 'User tidak ada'){
            window.location.href="/";
            Object.keys(Cookies.get()).forEach(function(cookieName) {
             Cookies.remove(cookieName, {});
            });
          } 
    }
    else if(user.is_error == false){
        await handleCookie(user.data.id, user.data.name, user.data.email, user.data.role.roles);
        return { user : user.data };
    }
}

export const getKeyValue = (object) => {
    return Object.keys(object).reduce(function (result, key) {
        return result.concat(
            object[key] && typeof object[key] === 'object' ?
            getKeyValue(object[key]) :
            [[key, object[key]]]
        );
    }, []);
}