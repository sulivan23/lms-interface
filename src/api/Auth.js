import axios from "axios";
import Cookies from "js-cookie";

export const AuthLogin = async(email, password) => {
    axios.defaults.withCredentials = true;
    const loginData = await axios.post('http://localhost:3001/auth/login', {
        email : email,
        password : password
    });
    return loginData;
}

export const AuthLogout = (userId) => {
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/auth/logout', {});
    Cookies.remove('userId');
    Cookies.remove('name');
    Cookies.remove('email');
}