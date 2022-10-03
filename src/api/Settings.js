import axios from "axios"

const url = 'http://localhost:3001/permission';

export const getPermissions = async() => {
    axios.defaults.withCredentials = true;
    const permission = await axios.get(url);
    return permission.data;
}

export const getPermissionById = async(id) => {
    axios.defaults.withCredentials = true;
    const permission = await axios.get(`${url}/${id}`);
    return permission.data;
}

export const createPermission = async(data) => {
    axios.defaults.withCredentials = true;
    const create = await axios.post(url, data);
    return create.data;
}

export const updatePermission = async(data, id) => {
    axios.defaults.withCredentials = true;
    const update = await axios.put(`${url}/${id}`, data);
    return update.data;
}

export const deletePermission = async(id) => {
    axios.defaults.withCredentials = true;
    const deleted = await axios.delete(`${url}/${id}`);
    return deleted.data;
}

export const getModul = async() => {
    axios.defaults.withCredentials = true;
    const modul = await axios.post(`${url}/modul`);
    return modul.data;
}

export const getMenu = async() => {
    axios.defaults.withCredentials = true;
    const menu = await axios.post(`${url}/menu`);
    return menu.data;
}