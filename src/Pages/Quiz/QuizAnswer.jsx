import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import iziToast from "izitoast";
import { handleMessage } from "../../api/Helper";
import { getMyQuizEmpByQuiz, getQuestionByQuizEmployee } from "../../api/Quiz";
import { quizAnswerQuestion, quizSubmitAnswer } from "../../api/Learning";
import Countdown, { zeroPad } from 'react-countdown';
import moment from "moment";
import swal from "sweetalert";

class QuizAnswer extends Component { 

    constructor(props){
        super(props);
        this.state = {
            quizTitle : '',
            listOfNumber : [],
            nameOfQuestion : '',
            courseId : '',
            questionNumber : '',
            answerOfQuestion : '',
            correctAnswer : '',
            isCorrect : '',
            questionType : '',
            quizEmployeeId : '',
            isQuestionExists : '',
            quizQuestionId : '',
            choiceValue : [],
            maxTime : '',
            isTimeRunOut : false,
            result : typeof this.props.match.params.result != 'undefined' ? true : false
        }
    }

    async componentDidMount() {
        await this.onLoadQuestion();
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevProps.match.params.questionNumber != this.props.match.params.questionNumber
            && this.props.match.params.questionNumber != ''){
            await this.resetState();
            await this.onLoadQuestion();
        }
        if(prevState.isTimeRunOut == false && this.state.isTimeRunOut == true && this.state.result == false){
            await this.submitAnswer();
        }
    }

    async resetState() {
        this.setState({ 
            nameOfQuestion : '',
            questionNumber : '',
            answerOfQuestion : '',
            questionType : '',
            quizQuestionId : '',
            courseId : '',
            onSave : false,
            onSubmit : false,
            maxTime : '',
            isTimeRunOut : false
        });
    }

    async onLoadQuestion() {
        try {
            const quiz = await getMyQuizEmpByQuiz(this.props.match.params.quizId, Cookies.get('userId'));
            this.setState({ 
                quizTitle : quiz.data.title, 
                quizEmployeeId : quiz.data.course.quiz_employee_id,
                courseId : quiz.data.course.id,
                maxTime : quiz.data.course.max_time
            });
            if(quiz.data == null){
                return this.props.history.push('/home/404');
            }
            if(quiz.data.course.status_quiz == 'Done' && this.state.result == false){
                this.props.history.push(`/home/learning/${this.state.courseId}/quiz/${this.props.match.params.quizId}`)
            }
            if(quiz.data.course.status_quiz != 'Done' && this.state.result == true){
                this.props.history.push(`/home/learning/${this.state.courseId}/quiz/${this.props.match.params.quizId}`)
            }
            const quest = await getQuestionByQuizEmployee(this.state.quizEmployeeId, this.props.match.params.questionNumber, this.state.result);
            var i;
            if(this.props.match.params.questionNumber < 1 || this.props.match.params.questionNumber > quiz.data.number_of_question){
                this.props.history.push('/home/quiz');
            }
            if(this.state.listOfNumber.length < quiz.data.number_of_question){
                for(i=1; i<=quiz.data.number_of_question; i++){
                    this.state.listOfNumber.push(i);
                }
            }
            if(quest.data.quiz != null){
                this.setState({ 
                    nameOfQuestion : quest.data.quiz.quiz_questions[0].name_of_question,
                    questionNumber : quest.data.quiz.quiz_questions[0].question_number,
                    answerOfQuestion : quest.data.quiz.quiz_questions[0].answer_of_question,
                    questionType : quest.data.quiz.quiz_questions[0].question_type,
                    choiceValue : quest.data.quiz.quiz_questions[0].quiz_multiple_choices,
                    isQuestionExists : true,
                    quizQuestionId : quest.data.quiz.quiz_questions[0].id
                });
                if(typeof quest.data.quiz.quiz_questions[0].correct_answer != 'undefined'){
                    this.setState({ 
                        correctAnswer : quest.data.quiz.quiz_questions[0].correct_answer,
                        isCorrect : quest.data.quiz.quiz_questions[0].is_correct
                    });
                }
            }else{
                this.setState({ isQuestionExists : false });
            }
        } catch(err) {
            console.log(err);
            iziToast.error({
                title : 'Error!',
                position : 'topRight'
            })
            this.props.history.push('/home/404');
        }
    }

    async onPage(type){
        if(type == 'next'){
            return this.props.history.push(`/home/quiz_answer/${this.props.match.params.quizId}/${parseFloat(this.props.match.params.questionNumber) + parseFloat(1)}${this.state.result == true ? '/result' : ''}`);
        }else{
            this.props.history.push(`/home/quiz_answer/${this.props.match.params.quizId}/${parseFloat(this.props.match.params.questionNumber) - parseFloat(1)}${this.state.result == true ? '/result' : ''}`);
        }
    }

    async saveAnswer() {
        try {
            this.setState({ onSave : true });
            setTimeout(async() => {
                const answer = await quizAnswerQuestion(this.state.quizEmployeeId, this.state.quizQuestionId, this.state.answerOfQuestion);
                if(answer.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(answer.message),
                        position : 'topRight'
                    });
                    await this.resetState();
                    await this.onLoadQuestion();
                    if(this.props.match.params.questionNumber < this.state.listOfNumber.length){
                        await this.onPage('next');
                    }
                }else {
                    iziToast.warning({
                        message : handleMessage(answer.message),
                        position : 'topRight'
                    });
                }
                this.setState({ onSave : false });
            }, 1000);
        } catch(err) {

        }
    }

    async confirmSubmitAnswer(){
        swal({
            title: "Are you sure?",
            text: "Please re-check your quiz answer before submit",
            icon: "info",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                await this.submitAnswer();
            }
        });
    }

    async submitAnswer() {
        try {
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                const submit = await quizSubmitAnswer(this.state.quizEmployeeId);
                if(submit.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(submit.message),
                        position : 'topRight'
                    });
                    this.props.history.push(`/home/learning/${this.state.courseId}/quiz/${this.props.match.params.quizId}`)
                }else {
                    iziToast.warning({
                        message : handleMessage(submit.message),
                        position : 'topRight'
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        } catch(err){
            console.log(err);
        }
    }

    render() {

        const Completionist = () => <span>Duration run out!</span>;

        const renderer = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
                if(this.state.isTimeRunOut == false){
                    this.setState({ isTimeRunOut : true });
                }
                return <Completionist />;
            } else {
                return <span className="bg-primary text-white p-1">{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
            }
        };

        console.log(moment(this.state.maxTime).format('Y-MM-DD HH:mm:ss'));
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Quiz : {this.state.quizTitle} </h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Quiz Answer</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <h2 className="section-title">Question Number : {this.props.match.params.questionNumber}</h2>
                        <p className="text-bold">
                            {
                                this.state.result == false ? 'Time remaining : ' : ''
                            }
                            { 
                                this.state.result == false ?
                                    <Countdown
                                        date={moment(this.state.maxTime).format('Y-MM-DD HH:mm:ss')}
                                        renderer={renderer}
                                    />
                                :
                                ''
                            }
                        </p>
                        <div className="row">
                            <div className="col-lg-3 col-sm-12 col-md-12">
                                <div className="card shadow-md">
                                    <div className="card-header bg-primary text-white">Question Number</div>
                                    <div className="card-body">
                                        <div className="row ml-2">
                                            {
                                                this.state.listOfNumber.map((list, number) => {
                                                    return (
                                                        // <div class="col-3">
                                                            <Link key={number} to={`/home/quiz_answer/${this.props.match.params.quizId}/${list}${this.state.result == true ? '/result' : ''}`} className={`${this.props.match.params.questionNumber == list ? 'btn btn-primary' : 'btn btn-light'} my-1 ml-1 col-3 w-100 font-weight-bold`}>{list}</Link>
                                                        // </div>
                                                    )
                                                })           
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-12 col-md-12">
                                <div className="card shadow-md">
                                    <div className="card-header bg-light">Question Type : {this.state.questionType}</div>
                                    <div className="card-body">
                                        {
                                            this.state.isQuestionExists == false ? 
                                                'Question not found' 
                                            : ''
                                        }
                                        <p>{this.state.nameOfQuestion}</p>
                                        {
                                             this.state.isQuestionExists == true ?
                                                this.state.questionType  == 'Multiple Choice' ?
                                                    this.state.choiceValue.map((choice, key) => {
                                                        return(
                                                            <p 
                                                            className=
                                                                {`${this.state.result == false || this.state.answerOfQuestion != choice.choice_type ? 
                                                                    'text-primary' 
                                                                : 
                                                                'text-white'}
                                                                 w-50 p-1
                                                                 ${this.state.answerOfQuestion == choice.choice_type  ?
                                                                        this.state.isCorrect == 'Y' ? ' bg-success' 
                                                                    : 
                                                                    'bg-danger'
                                                                :
                                                                choice.choice_type == this.state.correctAnswer ?
                                                                    this.state.isCorrect == 'T' ?
                                                                        'text-white bg-success'
                                                                    :
                                                                    ''
                                                                :
                                                                '' }`}>
                                                                <input 
                                                                    checked={this.state.answerOfQuestion == choice.choice_type ? true : false}
                                                                    type="radio" 
                                                                    name="radio" 
                                                                    key={key} onClick={(e) => this.setState({ answerOfQuestion : choice.choice_type  })} 
                                                                    disabled={this.state.result == true ? true : false} />
                                                                {' '}
                                                                {choice.choice_type}
                                                                {'. '}
                                                                {choice.choice_name}
                                                                {' '}
                                                                {
                                                                    this.state.result == true ?
                                                                        this.state.answerOfQuestion == choice.choice_type ? 
                                                                            this.state.isCorrect == 'Y' ?  <i className="fa fa-check text-white"></i>
                                                                            :
                                                                            <i className="fa fa-times text-white"></i>
                                                                        :
                                                                        choice.choice_type == this.state.correctAnswer ? 
                                                                            this.state.isCorrect == 'T' ?
                                                                                <i className="fa fa-check text-white"></i>
                                                                            :
                                                                            ''
                                                                        :
                                                                        ''
                                                                    :
                                                                    ''
                                                                }
                                                            </p>
                                                        )
                                                    })
                                                :
                                                <div>
                                                    <textarea
                                                        className="w-100"
                                                        style={{ height : '120px' }}
                                                        value={this.state.answerOfQuestion}
                                                        placeholder="Type the answer here..."
                                                        onChange={(e) => this.setState({ answerOfQuestion : e.target.value })}
                                                        disabled={this.state.result == true ? true : false}
                                                    ></textarea>
                                                    <p>
                                                        {   this.state.isCorrect == 'T' 
                                                                ? 'Your answer is incorrect'
                                                            : 
                                                            'Your answer is correct'
                                                        }
                                                        <br />
                                                        {
                                                            this.state.isCorrect == 'T' ?
                                                                'Correct answer : '+this.state.correctAnswer    
                                                            :
                                                            ''
                                                        }
                                                    </p>
                                                </div>
                                            :
                                            ''
                                        }
                                    </div>
                                    <div className="card-footer bg-light" style={{ 
                                                display : 'flex',
                                                justifyContent : 'space-around'
                                            }}>
                                        <div>
                                            {
                                                this.props.match.params.questionNumber > 1 ?
                                                    <button onClick={async() => await this.onPage('previous')} className="btn btn-warning"><i className="fa fa-arrow-left"></i> Previous</button>
                                                :
                                                ''
                                            }
                                            {
                                                this.state.result == false ?
                                                    <button onClick={async() => await this.saveAnswer() } className={`btn btn-primary ml-4 ${ this.state.onSave ? 'disabled btn-progress' : '' } `}><i className="fa fa-save"></i> Save</button>
                                                :
                                                ''
                                            }
                                            {
                                                this.props.match.params.questionNumber < this.state.listOfNumber.length?
                                                        <button onClick={async() => await this.onPage('next')} className="btn btn-info ml-4"><i className="fa fa-arrow-right"></i> Next</button>
                                                :
                                                this.state.result == false ?
                                                    <button onClick={async() => await this.confirmSubmitAnswer() } className={`btn btn-primary ml-4 ${ this.state.onSubmit ? 'disabled btn-progress' : '' } `}><i className="fa fa-save"></i> Submit</button>
                                                :
                                                ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default QuizAnswer;