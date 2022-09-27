import axios from "axios";

const url = 'http://localhost:3001/quiz_contest';

export const getQuizContest = async() => {
    axios.defaults.withCredentials = true;
    const quizContest = await axios.get(url);
    return quizContest.data    
}

export const getQuizContestById = async(id) => {
    axios.defaults.withCredentials = true;
    const quizContest = await axios.get(`${url}/${id}`);
    return quizContest.data;
}

export const createQuizContest = async(data) => {
    axios.defaults.withCredentials = true;
    const create = await axios.post(url, data);
    return create.data;
}

export const deleteQuizContest = async(id) => {
    axios.defaults.withCredentials = true;
    const deleted = await axios.delete(`${url}/${id}`);
    return deleted.data;
}

export const updateQuizContest = async(data, id) => {
    axios.defaults.withCredentials = true;
    const update = await axios.put(`${url}/${id}`, data);
    return update.data;
}

export const getPrizeByQuizContest= async(id) => {
    axios.defaults.withCredentials = true;
    const prize = await axios.get(`${url}/prize/${id}`);
    return prize.data;
}

export const createQuizContestQuestion = async(data) => {
    axios.defaults.withCredentials = true;
    const create = await axios.post(`${url}/question`, data);
    return create.data;
}

export const updateQuizContestQuestion = async(data, id) => {
    axios.defaults.withCredentials = true;
    const update = await axios.put(`${url}/question/${id}`, data);
    return update.data;
}

export const getQuestionsByQuizContest = async(quzContestId, questionNumber) => {
    axios.defaults.withCredentials = true;
    const quizContestQuestions = await axios.post(`${url}/question/quiz`, {
        quiz_contest_id : quzContestId,
        question_number : questionNumber
    });
    return quizContestQuestions.data;
}

export const deleteQuizContestQuestion = async(quizContestQuestionId) => {
    axios.defaults.withCredentials = true;
    const deleted = await axios.delete(`${url}/question/${quizContestQuestionId}`);
    return deleted.data;
}

export const setWinnerQuizContest = async(data) => {
    axios.defaults.withCredentials = true;
    const makeWinner = await axios.post(`${url}/winner`, data);
    return makeWinner.data;
}

export const getMyQuizContestByEmployee = async(quizContestId, employeeId) => {
    axios.defaults.withCredentials = true;
    const quizContest = await axios.post(`${url}/my_contest_employee`, {
        quiz_contest_id : quizContestId,
        employee_id : employeeId
    });
    return quizContest.data;
}

export const getQuestionQuizContestByEmp = async(quizContestEmployeeId, questionNumber) => {
    axios.defaults.withCredentials = true;
    const question = await axios.post(`${url}/question/employee`, {
        quiz_contest_employee_id : quizContestEmployeeId,
        question_number : questionNumber
    });
    return question.data;
}

export const getResultQuizContest = async(param) => {
    axios.defaults.withCredentials = true;
    const result = await axios.post(`${url}/result`, param);
    return result.data;
}

export const getWinnerQuizContest = async() => {
    axios.defaults.withCredentials = true;
    const winner = await axios.post(`${url}/winner`);
    return winner.data;
}