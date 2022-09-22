import axios from "axios";

const url = 'http://localhost:3001/quiz';
const urlQuest = 'http://localhost:3001/quiz_question'

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

export const createQuizQuestion = async(data) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.post(urlQuest, data);
    return quest.data;
}

export const updateQuizQuestion = async(data, id) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.put(`${urlQuest}/${id}`, data);
    return quest.data
}

export const deleteQuizQuestion = async(id) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.delete(`${urlQuest}/${id}`);
    return quest.data;
}

export const getQuestionByQuiz = async(quizId, quesdtionNumber) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.post(`${urlQuest}/quiz`, {
        quiz_id : quizId,
        question_number : quesdtionNumber
    });
    return quest.data;
}

export const getMyQuiz = async(employeeId) => {
    axios.defaults.withCredentials = true;
    const myQuiz = await axios.post(`${url}/my_quiz`, {
        employee_id : employeeId
    });
    return myQuiz.data;
}

export const getMyQuizEmpByQuiz = async(quizId, employeeId) => {
    axios.defaults.withCredentials = true;
    const quiz = await axios.post(`${url}/my_quiz_employee`, {
        quiz_id : quizId,
        employee_id : employeeId
    });
    return quiz.data;
}