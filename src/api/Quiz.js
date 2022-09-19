import axios from "axios";

const url = 'http://localhost:3001/quiz';

export const getQuiz = async() => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.get(url);
    return quiz.data;
}

export const getQuizById = async(id) => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.get(`${url}/${id}`);
    return quiz.data;
}

export const createQuiz = async(data) => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.post(url, data);
    return quiz.data;
}

export const updateQuiz = async(data, id) => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.put(`${url}/${id}`, data);
    return quiz.data;
}

export const deleteQuiz = async(id) => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.delete(`${url}/${id}`);
    return quiz.data;
}

export const getQuizByCourse = async(courseId) => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.post(`${url}/course`, {
        course_id : courseId
    });
    return quiz.data;
}