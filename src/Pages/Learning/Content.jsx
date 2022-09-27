import React, { Component } from "react";
import ExamPage from "./ExamPage";
import LessonPage from "./LessonPage";
import QuizPage from "./QuizPage";

class Content extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading : false,
            title : '',
            contentLesson : '',
            nextLesson : '',
            lessonLoaded : false,
            description : '',
            time : '',
            numberOfQuestion : '',
            passingGrade : '',
            organization : '',
            score : '',
            status : '',
            passedStatus : ''
        }
    }

    changeContentLesson(title, value, nextLesson = '') {
        this.setState({ 
            title : title,
            contentLesson : value,
            nextLesson : nextLesson 
        });
    }

    changeQuiz(title, description, quizTime, numberOfQuestion, organization, score, status){
        this.setState({
            title : title,
            description : description,
            time : quizTime,
            numberOfQuestion : numberOfQuestion,
            organization : organization,
            score : score,
            status : status
        });
    }

    changeExam(title, description, quizTime, numberOfQuestion, organization, score, status, passingGrade, passedStatus){
        this.setState({
            title : title,
            description : description,
            time : quizTime,
            numberOfQuestion : numberOfQuestion,
            organization : organization,
            score : score,
            status : status,
            passingGrade : passingGrade,
            passedStatus : passedStatus
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.nextLesson != this.state.nextLesson && this.state.nextLesson != ''){
            this.props.onRefreshContent(true);
            this.props.history(`/home/learning/${this.props.courseId}/lesson/${this.state.nextLesson}`)
        }
    }

    async onLoading(boolean) {
        this.setState({ loading : boolean });
        if(boolean == true){

        }
    }

    render(){
        return (
            <div>
                <div className="card">
                    {
                        this.props.type == 'lesson' ?
                            <LessonPage
                                lessonDetailId={this.props.id}
                                handleLoading={async(boolean) => await this.onLoading(boolean)}
                                courseEmployeeId={this.props.courseEmployeeId}
                                loading={this.state.loading}
                                contentLesson={{ 
                                    title : this.state.title, 
                                    content : this.state.contentLesson,
                                    lessonLoaded : this.state.lessonLoaded
                                }}
                                onMoveUrl={(url) => this.props.history(url)}
                                changeContent={(title, value, nextLesson) => this.changeContentLesson(title, value, nextLesson)}
                            />
                        : 
                        (this.props.type == 'quiz' ? 
                            <QuizPage
                                quizId={this.props.id}
                                handleLoading={async(boolean) => await this.onLoading(boolean)}
                                courseEmployeeId={this.props.courseEmployeeId}
                                loading={this.state.loading}
                                contentQuiz={{
                                    title : this.state.title,
                                    description : this.state.description,
                                    quizTime : this.state.time,
                                    numberOfQuestion : this.state.numberOfQuestion,
                                    score : this.state.score,
                                    status : this.state.status
                                }}
                                onMoveUrl={() => this.props.history(`/home/quiz_answer/${this.props.id}/1`)}
                                onChangeQuiz={(title, description, quizTime, numberOfQuestion, organization, score, status) => this.changeQuiz(title, description, quizTime, numberOfQuestion, organization, score, status)}
                            />
                        :
                            <ExamPage
                                examId={this.props.id}
                                handleLoading={async(boolean) => await this.onLoading(boolean)}
                                courseEmployeeId={this.props.courseEmployeeId}
                                loading={this.state.loading}
                                contentExam={{
                                    title : this.state.title,
                                    description : this.state.description,
                                    examTime : this.state.time,
                                    numberOfQuestion : this.state.numberOfQuestion,
                                    score : this.state.score,
                                    status : this.state.status,
                                    passingGrade : this.state.passingGrade,
                                    passedStatus : this.state.passedStatus
                                }}
                                onMoveUrl={() => this.props.history(`/home/exam_answer/${this.props.id}/1`)}
                                onChangeExam={(title, description, quizTime, numberOfQuestion, organization, score, status, passingGrade, passedStatus) => this.changeExam(title, description, quizTime, numberOfQuestion, organization, score, status, passingGrade, passedStatus)}
                            />
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Content;