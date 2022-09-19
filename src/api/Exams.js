import { refreshToken } from "./Users";
import axios from "axios";

const url = 'http://localhost:3001/exam';

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

}

export const deleteQuestionExam = async(id) => {

}

export const updateQuestionExam = async(data, id) => {

}

export const createExamQuestion = async(data) => {

}