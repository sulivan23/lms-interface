import axios from "axios";

const url = "http://localhost:3001/key_performance"

export const createKPI = async(data) => {
    axios.defaults.withCredentials = true;
    const create = await axios.post(url, data);
    return create.data;
}

export const getKPI = async() => {
    axios.defaults.withCredentials = true;
    const kpi = await axios.get(url);
    return kpi.data;
}

export const getKPIById = async(id) => {
    axios.defaults.withCredentials = true;
    const kpi = await axios.get(`${url}/${id}`);
    return kpi.data;
}

export const updateKPI = async(data, id) => {
    axios.defaults.withCredentials = true;
    const update = await axios.put(`${url}/${id}`, data);
    return update.data;
}

export const deleteKPI = async(id) => {
    axios.defaults.withCredentials = true;
    const deleted = await axios.delete(`${url}/${id}`);
    return deleted.data;
}