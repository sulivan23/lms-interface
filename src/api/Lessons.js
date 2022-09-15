import axios from "axios"
import { refreshToken } from "./Users";

const urlLesson = 'http://127.0.0.1:3001/lesson';
const urlLessonContent = 'http://127.0.0.1:3001/lesson_detail';

export const getLesson = async() => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.get(urlLesson, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lesson.data;
}

export const getLessonById = async(id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.get(`${urlLesson}/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lesson.data;
}

export const createLesson = async(data) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.post(urlLesson, data, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lesson.data;
}

export const deleteLesson = async(id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.delete(`${urlLesson}/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lesson.data;
}

export const updateLesson = async(data, id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.put(`${urlLesson}/${id}`, data, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lesson.data;
}

export const getLessonByCourse = async(course) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.post(`${urlLesson}/course`, {
        course_id : course
    }, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lesson.data;
}

export const createLessonContent = async(data) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const create = await axios.post(urlLessonContent, data , {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return create.data
}

export const updateLessonContent = async(data, id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const updated = await axios.put(`${urlLessonContent}/${id}`, data, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return updated.data;
}

export const deleteLessonContent = async(id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lessonContent = await axios.delete(`${urlLessonContent}/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lessonContent.data;
}

export const getLessonContentByLesson = async(lessonId) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lessonContent = await axios.post(`${urlLessonContent}/lesson`, {
        lesson_id : lessonId
    }, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    })
    return lessonContent.data;
}

export const uploadImgContent = async(image) => {
    axios.defaults.withCredentials = true;
    var formData = new FormData();
    formData.append('file', image);
    const accessToken = await refreshToken();
    const upload = await axios.post(`${urlLesson}/upload_image`, formData, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return upload.data;
}

export const deleteImgContent = async(image) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const deleted = await axios.get(`${urlLesson}/delete_image/${image.replace('http://127.0.0.1:3001/lesson/image/','')}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return deleted.data;
}

export const getLessonContentById = async(id) => {
    axios.defaults.withCredentials = true;
    const accessToken = await refreshToken();
    const lesson = await axios.get(`${urlLessonContent}/${id}`, {}, {
        headers : {
            'Authorization' : `Bearer ${accessToken}`
        }
    });
    return lesson.data;
}