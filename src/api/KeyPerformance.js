import axios from "axios";

const url = "http://localhost:3001/key_performance"
const urlReport = "http://localhost:3001/report";

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

export const reportDashboardEmployee = async(employeeId) => {
    axios.defaults.withCredentials = true;
    const report = await axios.post(`${urlReport}/dashboard`, {
        employee_id : employeeId
    });
    return report.data;
}

export const reportKPI = async(organizationCode, employeeId) => {
    axios.defaults.withCredentials = true;
    const report = await axios.post(`${urlReport}/kpi`, {
        organization_code : organizationCode,
        employee_id : employeeId
    });
    return report.data;
}

export const reportCourse = async(organizationCode, employeeId) => {
    axios.defaults.withCredentials = true;
    const report = await axios.post(`${urlReport}/course`, {
        organization_code : organizationCode,
        employee_id : employeeId
    });
    return report.data;
}