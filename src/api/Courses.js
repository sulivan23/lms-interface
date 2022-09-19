import axios from "axios"

const url = 'http://localhost:3001/course';

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
    const enroll = await axios.post(url, data);
    return enroll;
}