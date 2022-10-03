import axios from "axios"

const url = 'http://localhost:3001/course';
const urlLearning = 'http://localhost:3001/learning';
const urlCert = 'http://localhost:3001/certificate';

export const getCourse = async() => {
    axios.defaults.withCredentials = true;
    const courses = await axios.get(url);
    return courses.data;
}

export const getCourseById = async(id) => {
    axios.defaults.withCredentials = true;
    const courses = await axios.get(`${url}/${id}`);
    return courses.data
}

export const deletedCourse = async(id) => {
    axios.defaults.withCredentials = true;
    const deleted = await axios.delete(`${url}/${id}`);
    return deleted.data;
}

export const updateCourse = async(data, id) => {
    axios.defaults.withCredentials = true;
    const updated = await axios.put(`${url}/${id}`, {
        course_name : data.course_name,
        organization_code : data.organization,
        description : data.description,
        due_date : data.due_date,
        created_by : data.created_by
    });
    return updated.data;
}

export const createCourse = async(data) => {
    axios.defaults.withCredentials = true;
    const create = await axios.post(url,{
        course_name : data.course_name,
        organization_code : data.organization,
        description : data.description,
        due_date : data.due_date,
        created_by : data.created_by
    });
    return create.data;
}

export const getCoursesByOrg = async(org) => {
    axios.defaults.withCredentials = true;
    const courses = await axios.post(`${url}/org`, {
        organization_code : org
    });
    return courses.data;
}

export const enrollCourse = async(data) => {
    axios.defaults.withCredentials = true;
    const enroll = await axios.post(urlLearning, data);
    return enroll.data;
}

export const getMyCourses = async(employeeId) => {
    axios.defaults.withCredentials = true;
    const courses = await axios.post(`${url}/my_courses`, {
        employee_id : employeeId
    });
    return courses.data;
}

export const downloadCertificate = async(code) => {
    axios.defaults.withCredentials = true;
    const download = await axios.get(`${urlCert}/${code}`);
    return download.data;
}