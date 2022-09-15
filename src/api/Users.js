import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode"

export const refreshToken = async() => {
    try { 
        axios.defaults.withCredentials = true;
        const token = await axios.post('http://localhost:3001/auth/refresh_token', {});
        return token;
    } catch(err) {
        console.log(err);
    }
}

export const getUser = async(id) => {
    try {
        axios.defaults.withCredentials = true;
        const accessToken = await refreshToken();
        const user = await axios.get(`http://localhost:3001/user/${id}`, {}, {
            headers : {
                'Authorization' : `Bearer ${accessToken}`
            }
        });
        return {
            userData : user.data,
            newToken : accessToken.data
        }
    } catch(err) {
        console.log(err);
    }
}

export const getUsers = async() => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const user = await axios.get('http://localhost:3001/user', {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return user.data;
}

export const getUsersByOrg = async(org) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const user = await axios.post('http://localhost:3001/user/org', {
        organization_code : org
    }, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return user.data;
}

export const getUserById = async(id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const user = await axios.get(`http://localhost:3001/user/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return user.data;
}

export const deleteUser = async(id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const deleted = await axios.delete(`http://localhost:3001/user/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return deleted.data;
}

export const createUser = async(data) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const createUser = await axios.post('http://localhost:3001/user', data , {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return createUser.data;
}

export const updateUser = async(data, id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const updateUser = await axios.put(`http://localhost:3001/user/${id}`, data , {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return updateUser.data;
}

export const getRoles = async() => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const roles = await axios.get('http://127.0.0.1:3001/roles', {} ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return roles.data;
}

export const getPosition = async() => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const position = await axios.get('http://127.0.0.1:3001/position', {} ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return position.data;
}

export const getPositionCode = async(code) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const position = await axios.get(`http://127.0.0.1:3001/position/${code}`, {} ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return position.data;
}

export const createPosition = async(data) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const position = await axios.post('http://127.0.0.1:3001/position', data ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return position.data;
}

export const updatePosition = async(data, code) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const position = await axios.put(`http://127.0.0.1:3001/position/${code}`, data ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return position.data;
}

export const deletePosition = async(code) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const position = await axios.delete(`http://127.0.0.1:3001/position/${code}`, {} ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return position.data;
}

export const handleCookie = async(userId, name, email, role) => {
    if(Cookies.get('userId') != userId) Cookies.set('userId', userId);
    if(Cookies.get('name') != name) Cookies.set('name', name);
    if(Cookies.get('email') != email) Cookies.set('email', email);
    if(Cookies.get('role') != role) Cookies.set('role', role);
}

export const getPermission = async(data) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const permission = await axios.post(`http://127.0.0.1:3001/roles/permission`, data ,{
        headers :{
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return permission.data;   
}