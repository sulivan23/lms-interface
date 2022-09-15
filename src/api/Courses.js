import axios from "axios"
import { refreshToken } from "./Users";

const url = 'http://127.0.0.1:3001/course';

export const getCourse = async() => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const courses = await axios.get(url, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return courses.data;
}

export const getCourseById = async(id) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const courses = await axios.get(`${url}/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return courses.data
}

export const deletedCourse = async(id) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const deleted = await axios.delete(`${url}/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return deleted.data;
}

export const updateCourse = async(data, id) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const updated = await axios.put(`${url}/${id}`, {
        course_name : data.course_name,
        organization_code : data.organization,
        due_date : data.due_date,
        created_by : data.created_by
    }, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return updated.data;
}

export const creteCourse = async(data) => {
    const accessToken = await refreshToken();
    axios.defaults.withCredentials = true;
    const create = await axios.post(url,{
        course_name : data.course_name,
        organization_code : data.organization,
        due_date : data.due_date,
        created_by : data.created_by
    }, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return create.data;
}