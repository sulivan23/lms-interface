import axios from "axios"

const urlLesson = 'http://localhost:3001/lesson';
const urlLessonContent = 'http://localhost:3001/lesson_detail';

export const getLesson = async() => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.get(urlLesson)
    return lesson.data;
}

export const getLessonById = async(id) => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.get(`${urlLesson}/${id}`)
    return lesson.data;
}

export const createLesson = async(data) => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.post(urlLesson, data)
    return lesson.data;
}

export const deleteLesson = async(id) => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.delete(`${urlLesson}/${id}`)
    return lesson.data;
}

export const updateLesson = async(data, id) => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.put(`${urlLesson}/${id}`, data)
    return lesson.data;
}

export const getLessonByCourse = async(course) => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.post(`${urlLesson}/course`, {
        course_id : course
    })
    return lesson.data;
}

export const createLessonContent = async(data) => {
    axios.defaults.withCredentials = true;
    const create = await axios.post(urlLessonContent, data)
    return create.data
}

export const updateLessonContent = async(data, id) => {
    axios.defaults.withCredentials = true;
    const updated = await axios.put(`${urlLessonContent}/${id}`, data);
    return updated.data;
}

export const deleteLessonContent = async(id) => {
    axios.defaults.withCredentials = true;
    const lessonContent = await axios.delete(`${urlLessonContent}/${id}`)
    return lessonContent.data;
}

export const getLessonContentByLesson = async(lessonId) => {
    axios.defaults.withCredentials = true;
    const lessonContent = await axios.post(`${urlLessonContent}/lesson`, {
        lesson_id : lessonId
    })
    return lessonContent.data;
}

export const uploadImgContent = async(image) => {
    axios.defaults.withCredentials = true;
    var formData = new FormData();
    formData.append('file', image);
    const upload = await axios.post(`${urlLesson}/upload_image`, formData, {
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    });
    return upload.data;
}

export const deleteImgContent = async(image) => {
    axios.defaults.withCredentials = true;
    const deleted = await axios.get(`${urlLesson}/delete_image/${image.replace('http://localhost:3001/lesson/image/','')}`);
    return deleted.data;
}

export const getLessonContentById = async(id) => {
    axios.defaults.withCredentials = true;
    const lesson = await axios.get(`${urlLessonContent}/${id}`);
    return lesson.data;
}