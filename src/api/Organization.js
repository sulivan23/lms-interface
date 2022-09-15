import axios from "axios"
import { refreshToken } from "./Users";

const url = 'http://127.0.0.1:3001/organization';

export const getOrganization = async() => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const org = await axios.get(url, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return org.data;
}

export const createOrganization = async(data) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const org = await axios.post(url, {
        organization_code : data.organization_code,
        organization_name : data.organization_name,
        organization_code_head : data.organization_code_head,
        organization_type : data.organization_type
    },{
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return org.data;
}

export const updateOrganization = async(data, code) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const org = await axios.put(`${url}/${code}`, {
        organization_code : data.organization_code,
        organization_name : data.organization_name,
        organization_code_head : data.organization_code_head,
        organization_type : data.organization_type
    },{
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return org.data
}

export const getOrganizationByCode = async(code) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const org = await axios.get(`${url}/${code}`, {},{
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return org.data;
}

export const deleteOrganization = async(code) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const org = await axios.delete(`${url}/${code}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return org.data;
}