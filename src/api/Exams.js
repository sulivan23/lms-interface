import { refreshToken } from "./Users";
import axios from "axios";

const url = 'http://localhost:3001/exam';
const urlQuest = 'http://localhost:3001/exam_question'

export const getExams = async() => {
    axios.defaults.withCredentials = true;
    const exams = await axios.get(url);
    return exams.data;
}

export const getExamById = async(id) => {
    axios.defaults.withCredentials = true;
    const exam = await axios.get(`${url}/${id}`);
    return exam.data;
}

export const createExam = async(data) => {
    axios.defaults.withCredentials = true;
    const exams = await axios.post(url, data);
    return exams.data;
}

export const updateExam = async(data, id) => {
    axios.defaults.withCredentials = true;
    const exams = await axios.put(`${url}/${id}`, data);
    return exams.data;
}

export const deleteExam = async(id) => {
    axios.defaults.withCredentials = true;
    const exams = await axios.delete(`${url}/${id}`);
    return exams.data;
}

export const getExamByCourse = async(courseId) => {
    axios.defaults.withCredentials = true;
    const exam = await axios.post(`${url}/course`, {
        course_id : courseId
    });
    return exam.data;
}

export const getQuestionByExam = async(examId, questionNumber) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.post(`${urlQuest}/exam`, {
        exam_id : examId,
        question_number : questionNumber
    });
    return quest.data;
}

export const deleteExamQuestion = async(id) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.delete(`${urlQuest}/${id}`);
    return quest.data;
}

export const updateExamQuestion = async(data, id) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.put(`${urlQuest}/${id}`, data);
    return quest.data;
}

export const createExamQuestion = async(data) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.post(`${urlQuest}`, data);
    return quest.data;
}

export const getMyExams = async(employeeId) => {
    axios.defaults.withCredentials = true;
    const myExams = await axios.post(`${url}/my_exam`, {
        employee_id : employeeId
    });
    return myExams.data;
}

export const getMyExamEmpByExam = async(examId, employeeId) => {
    axios.defaults.withCredentials = true;
    const exam = await axios.post(`${url}/my_exam_employee`, {
        exam_id : examId,
        employee_id : employeeId
    });
    return exam.data;
}

export const getQuestionByExamEmployee = async(examEmployeeId, questionNumber) => {
    axios.defaults.withCredentials = true;
    const quest = await axios.post(`${urlQuest}/exam_employee`, {
        exam_employee_id : examEmployeeId,
        question_number : questionNumber
    });
    return quest.data;
}

export const getResultExam = async(param) => {
    axios.defaults.withCredentials = true;
    const result = await axios.post(`${url}/result`, param);
    return result.data;
}