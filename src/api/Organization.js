import axios from "axios";

const url = 'http://localhost:3001/organization';

export const getOrganization = async() => {
    axios.defaults.withCredentials = true;
    const org = await axios.get(url);
    return org.data;
}

export const createOrganization = async(data) => {
    axios.defaults.withCredentials = true;
    const org = await axios.post(url, {
        organization_code : data.organization_code,
        organization_name : data.organization_name,
        organization_code_head : data.organization_code_head,
        organization_type : data.organization_type
    });
    return org.data;
}

export const updateOrganization = async(data, code) => {
    axios.defaults.withCredentials = true;
    const org = await axios.put(`${url}/${code}`, {
        organization_code : data.organization_code,
        organization_name : data.organization_name,
        organization_code_head : data.organization_code_head,
        organization_type : data.organization_type
    });
    return org.data
}

export const getOrganizationByCode = async(code) => {
    axios.defaults.withCredentials = true;
    const org = await axios.get(`${url}/${code}`);
    return org.data;
}

export const deleteOrganization = async(code) => {
    axios.defaults.withCredentials = true;
    const org = await axios.delete(`${url}/${code}`);
    return org.data;
}