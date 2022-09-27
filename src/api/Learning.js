import axios from "axios"

const url = 'http://localhost:3001/learning';

export const getListContent = async(employeeId, courseId) => {
    axios.defaults.withCredentials = true;
    const content = await axios.post(url, {
        type : 'get_list_content',
        data : {
            employee_id : employeeId,
            course_id : courseId
        }
    });
    return content.data;
}

export const completedSubLesson = async(courseEmployeeId, lessonDetailId, status) => {
    axios.defaults.withCredentials = true;
    const completed = await axios.post(url, {
        type : 'completed_sub_lesson',
        data : {
            course_employee_id : courseEmployeeId,
            lesson_detail_id : lessonDetailId,
            status : status
        }
    });
    return completed.data;
}

export const enrollExam = async(courseEmployeeId, examId) => {
    axios.defaults.withCredentials = true;
    const enroll = await axios.post(url, {
        type : 'enroll_exam',
        data : {
            course_employee_id : courseEmployeeId,
            exam_id : examId
        }
    });
    return enroll.data;
}

export const examAnswerQuestion = async(examEmployeeId, examQuestionId, answerOfQuestion) => {
    axios.defaults.withCredentials = true;
    const answer = await axios.post(url, {
        type : 'exam_answer_question',
        data : {
            exam_employee_id : examEmployeeId,
            exam_question_id : examQuestionId,
            answer_of_question : answerOfQuestion
        }
    });
    return answer.data;
}

export const examSubmitAnswer = async(examEmployeeId) => {
    axios.defaults.withCredentials = true;
    const submit = await axios.post(url, {
        type : 'exam_submit_answer',
        data : {
            exam_employee_id : examEmployeeId
        }
    });
    return submit.data;
}

export const enrollQuiz = async(courseEmployeeId, quizId) => {
    axios.defaults.withCredentials = true;
    const enroll = await axios.post(url, {
        type : 'enroll_quiz',
        data : {
            course_employee_id : courseEmployeeId,
            quiz_id : quizId
        }
    });
    return enroll.data
}

export const quizAnswerQuestion = async(quizEmployeeId, quizQuestionId, answerOfQuestion ) => {
    axios.defaults.withCredentials = true;
    const answer = await axios.post(url, {
        type : 'quiz_answer_question',
        data : {
            quiz_employee_id : quizEmployeeId,
            quiz_question_id : quizQuestionId,
            answer_of_question : answerOfQuestion
        }
    });
    return answer.data;
}

export const quizSubmitAnswer = async(quizEmployeeId) => {
    axios.defaults.withCredentials = true;
    const submit = await axios.post(url, {
        type : 'quiz_submit_answer',
        data : {
            quiz_employee_id : quizEmployeeId
        }
    });
    return submit.data;
}

export const enrollQuizContest = async(employeeId, quizContestId) => {
    axios.defaults.withCredentials = true;
    const enroll = await axios.post(url, {
        type : 'enroll_quiz_contest',
        data : {
            employee_id : employeeId,
            quiz_contest_id : quizContestId
        }
    });
    return enroll.data;
}

export const quizContestAnswerQuestion = async(contestEmployeeId, contestQuestionId, answerOfQuestion) => {
    axios.defaults.withCredentials = true;
    const answer = await axios.post(url, {
        type : 'quiz_contest_answer_question',
        data : {
            "contest_employee_id" : contestEmployeeId,
            "contest_question_id" : contestQuestionId,
            "answer_of_question" : answerOfQuestion
        }
    });
    return answer.data;
}

export const quizContestSubmitAnswer = async(contestEmployeeId) => {
    axios.defaults.withCredentials = true;
    const submit = await axios.post(url, {
        type : 'quiz_contest_submit_answer',
        data : {
            "contest_employee_id" : contestEmployeeId
        }
    });
    return submit.data;
}