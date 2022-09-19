import axios from "axios";
import Cookies from "js-cookie";

const urlAuth = 'http://localhost:3001/auth';

export const AuthLogin = async(email, password) => {
    axios.defaults.withCredentials = true;
    const loginData = await axios.post(`${urlAuth}/login`, {
        email : email,
        password : password
    });
    return loginData;
}

export const AuthLogout = (userId) => {
    axios.defaults.withCredentials = true;
    axios.post(`${urlAuth}/logout`, {});
    Cookies.remove('userId');
    Cookies.remove('name');
    Cookies.remove('email');
}