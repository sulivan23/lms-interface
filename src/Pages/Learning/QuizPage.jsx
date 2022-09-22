import iziToast from "izitoast";
import Cookies from "js-cookie";
import React, { Component } from "react"
import { handleMessage } from "../../api/Helper";
import { enrollQuiz } from "../../api/Learning";
import { getMyQuizEmpByQuiz, getQuizById } from "../../api/Quiz";

class QuizPage extends Component {
    constructor(props){
        super(props);
    }

    async componentDidMount(){
        await this.getQuiz();
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.quizId != this.props.quizId && this.propz.quizId != ''){
            await this.getQuiz();
        }
    }

    async getQuiz() {
        const quiz = await getMyQuizEmpByQuiz(this.props.quizId, Cookies.get('userId'));
        this.props.onChangeQuiz(quiz.data.title, quiz.data.description, quiz.data.quiz_time, quiz.data.number_of_question, quiz.data.course.organization_code, quiz.data.course.score,quiz.data.course.status_quiz);
    }

    async enrollQuiz() {
        try {
            this.props.handleLoading(true);
            setTimeout(async() => {
                const enroll = await enrollQuiz(this.props.courseEmployeeId, this.props.quizId);
                if(enroll.is_error == false){
                    this.props.onMoveUrl();
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }else{
                    iziToast.warning({
                        title: "Warning!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }
                this.props.handleLoading(false);
            }, 1000)
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <div className="card-header bg-light text-dark">
                    <h4 className="text-dark">Title : { this.props.contentQuiz.title }</h4>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Description</label>
                        <p>{this.props.contentQuiz.description}</p>
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <p>{this.props.contentQuiz.quizTime+ ' Minutes'}</p>
                    </div>
                    <div className="form-group">
                        <label>Number Of Question</label>
                        <p>{this.props.contentQuiz.numberOfQuestion}</p>
                    </div>
                    <div className="form-group">
                        <label>Quiz Status</label>
                        <p>{this.props.contentQuiz.status == null ? 'Not Started' : this.props.contentQuiz.status}</p>
                    </div>
                    <div className="form-group">
                        <label>Score</label>
                        <p>{this.props.contentQuiz.score == null ? 0 : this.props.contentQuiz.score} Point</p>
                    </div>
                </div>
                <div className="card-footer bg-light">
                    <button 
                        className={`btn btn-primary ${this.props.loading ? 'disabled btn-progress' : ''}`} 
                        onClick={async() => await this.enrollQuiz()}>
                        { this.props.contentQuiz.status == null ? 'Start Quiz' 
                            : 
                            (this.props.contentQuiz.status == 'In Progress' 
                            ? 'Continue Quiz' : 'You have finished this quiz') 
                        }
                    </button>
                </div>
            </div>
        )
    }
}

export default QuizPage;