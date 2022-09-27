import React, { Component } from "react";
import { Link } from "react-router-dom";
import iziToast from "izitoast";
import { handleMessage } from "../../../api/Helper";
import swal from "sweetalert";
import { createQuizContestQuestion, deleteQuizContestQuestion, getQuestionsByQuizContest, getQuizContestById, updateQuizContestQuestion } from "../../../api/QuizContest";
class QuizContestQuestions extends Component {

    constructor(props){
        super(props);
        this.state = {
            quizContestTitle : '',
            listOfNumber : [],
            nameOfQuestion : '',
            questionNumber : '',
            answerOfQuestion : '',
            questionType : '',
            onSubmit: false,
            onDelete: false,
            isEndOfQuestion : false,
            multipleChoice : [],
            choiceType : ['A','B','C','D','E'],
            choiceValue : [],
            isQuestionExists : false,
            quizContestQuestionId : ''
        }
    }

    async componentDidMount() {
        await this.onLoadQuestion();
    }

    async onLoadQuestion() {
        const quizContest = await getQuizContestById(this.props.match.params.quizContestId);
        const quest = await getQuestionsByQuizContest(this.props.match.params.quizContestId, this.props.match.params.questionNumber);
        var i;
        if(quizContest.data == null){
            return this.props.history.push('/home/quiz_contest');
        }
        if(this.props.match.params.questionNumber < 1 || this.props.match.params.questionNumber > quizContest.data.number_of_question){
            this.props.history.push('/home/quiz_contest');
        }
        if(this.state.listOfNumber.length < quizContest.data.number_of_question){
        for(i=1; i<=quizContest.data.number_of_question; i++){
                this.state.listOfNumber.push(i);
            }
        }
        this.setState({ quizContestTitle : quizContest.data.title })
        if(quest.data != null){
            this.setState({ 
                nameOfQuestion : quest.data.name_of_question,
                questionNumber : quest.data.question_number,
                answerOfQuestion : quest.data.answer_of_question,
                questionType : quest.data.question_type,
                choiceValue : quest.data.quiz_contest_multiple_choices,
                isQuestionExists : true,
                quizContestQuestionId : quest.data.id
            });
        }else{
            this.setState({ isQuestionExists : false });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.questionNumber != this.props.match.params.questionNumber
            && this.props.match.params.questionNumber != ''){
            await this.resetState();
            await this.onLoadQuestion();
        }
    }

    async resetState() {
        this.setState({ 
            nameOfQuestion : '',
            questionNumber : '',
            answerOfQuestion : '',
            questionType : '',
            choiceValue : [],
            quizContestQuestionId : ''
        });
    }

    async saveQuestion() {
        var data = {
            quiz_contest_id : this.props.match.params.quizContestId,
            name_of_question : this.state.nameOfQuestion,
            answer_of_question : this.state.answerOfQuestion,
            question_number : this.props.match.params.questionNumber,
            question_type : this.state.questionType,
        };
        if(this.state.questionType == 'Multiple Choice'){
            Object.assign(data, {
                multiple : this.state.choiceValue
            });
        }
        this.setState({ onSubmit : true });
        setTimeout(async() => {
            var save
            if(this.state.isQuestionExists == false){
                save = await createQuizContestQuestion(data);
            }else {
                save = await updateQuizContestQuestion(data, this.props.match.params.quizContestId);
            }
            if(save.is_error == false){
                iziToast.success({
                    title : 'Success!',
                    message : handleMessage(save.message),
                    position : 'topRight'
                });
                await this.resetState();
                await this.onLoadQuestion();
            }else {
                iziToast.warning({
                    message : handleMessage(save.message),
                    position : 'topRight'
                });
            }
            this.setState({ onSubmit : false });
        }, 1000);
    }

    async deleteQuestion() {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this question",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                if(this.state.quizContestQuestionId == ''){
                    return iziToast.error({
                        title: "Error!",
                        message: 'Gagal, pertanyaan belum di save',
                        position: "topRight",
                    });
                }
                const deleted = await deleteQuizContestQuestion(this.state.quizContestQuestionId);
                if(deleted.is_error == false){
                    await this.resetState();
                    await this.onLoadQuestion();
                    return iziToast.success({
                        title: "Success!",
                        message: handleMessage(deleted.message),
                        position: "topRight",
                    });
                }else {
                    return iziToast.error({
                        title: "Error!",
                        message: handleMessage(deleted.message),
                        position: "topRight",
                    });
                }
            }
        });
    }

    onChangeQuestType(val) {
        this.setState({ questionType : val, answerOfQuestion : '' });
    }

    onChangeQuestName(questType, value){
        var arrValue = this.state.choiceValue;
        var foundIndex = arrValue.findIndex(x => x.choice_type == questType);
        if(foundIndex >= 0){
            if(value != ''){
                arrValue[foundIndex].choice_name = value;
            }else{
                arrValue.splice(foundIndex, 1);
            }
        }else{
            arrValue = [...arrValue, {
                choice_type : questType,
                choice_name : value
            }];
        }
        this.setState({ choiceValue : arrValue });
    }

    async onPage(type){
        if(type == 'next'){
            return this.props.history.push(`/home/quiz_contest/${this.props.match.params.quizContestId}/${parseFloat(this.props.match.params.questionNumber) + parseFloat(1)}`);
        }else{
            this.props.history.push(`/home/quiz_contest/${this.props.match.params.quizContestId}/${parseFloat(this.props.match.params.questionNumber) - parseFloat(1)}`);
        }
    }

    render() {
        return(
               <div className="main-content">
             <section className="section">
                    <div className="section-header">
                    <h1>Quiz Contest : {this.state.quizContestTitle} </h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Quiz Question</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <h2 className="section-title">Question Number : {this.props.match.params.questionNumber}</h2>
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
                                                            <Link key={number} to={`/home/quiz_contest/${this.props.match.params.quizContestId}/${list}`} className={`${this.props.match.params.questionNumber == list ? 'btn btn-primary' : 'btn btn-light'} my-1 ml-1 col-3 w-100 font-weight-bold`}>{list}</Link>
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
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Name Of Question</label>
                                            <textarea
                                                height="250"
                                                width="500"
                                                className="form-control"
                                                onChange={(e) => this.setState({ nameOfQuestion : e.target.value })}
                                                placeholder="Name Of Question..."
                                                value={this.state.nameOfQuestion}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Question Type</label>
                                            <select 
                                                className="form-control"
                                                value={this.state.questionType}
                                                onChange={(e) =>  this.onChangeQuestType(e.target.value)}
                                            >
                                                <option value="">Choose Type</option>
                                                <option value="Multiple Choice">Multiple Choice</option>
                                                <option value="Essay">Essay</option>
                                            </select>
                                        </div>
                                        {   this.state.questionType == 'Multiple Choice' ?
                                                this.state.choiceType.map((choice, key) => {
                                                    return (
                                                        <div className="row">
                                                            <div class="col-6">
                                                                <div className="form-group">
                                                                    <label>Choice Type</label>
                                                                    <select
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={choice}
                                                                        disabled
                                                                    >
                                                                        <option value="">Choose</option>
                                                                        {
                                                                            this.state.choiceType.map((choiceVal, key) => {
                                                                                return (
                                                                                    <option key={key} value={choiceVal}>{choiceVal}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div class="col-6">
                                                                <div className="form-group">
                                                                    <label>Choice Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Choice Name..."
                                                                        value={this.state.choiceValue.filter((item) => {
                                                                            return item.choice_type == choice
                                                                        }).map((result) => {
                                                                            return result.choice_name
                                                                        })}
                                                                        onChange={(e) => this.onChangeQuestName(choice, e.target.value) }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            : ''
                                        }
                                           <div className="form-group">
                                            <label>Answer Of Question</label>
                                            {
                                                this.state.questionType == '' || this.state.questionType == 'Essay'
                                                ?
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.answerOfQuestion}
                                                    placeholder="Answer Of Question..."
                                                    onChange={(e) =>  this.setState({ answerOfQuestion : e.target.value })}
                                                />
                                                :
                                                <select
                                                    className="form-control"
                                                    value={this.state.answerOfQuestion}
                                                    onChange={(e) => this.setState({ answerOfQuestion : e.target.value })}
                                                >
                                                    <option value="">Choose</option>
                                                    {
                                                        this.state.choiceValue.filter((item) => { 
                                                            return item.choice_name != 'A' 
                                                        }).map((choiceVal, key) => {
                                                            return (
                                                                <option key={key} value={choiceVal.choice_type}>{choiceVal.choice_type}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            }
                                        </div>
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
                                            <button onClick={async() => await this.deleteQuestion() } className={`btn btn-danger ml-4 ${ this.state.onDelete ? 'disabled btn-progress' : '' } `}><i className="fa fa-trash"></i> Delete</button>
                                            <button onClick={async() => await this.saveQuestion() } className={`btn btn-primary ml-4 ${ this.state.onSubmit ? 'disabled btn-progress' : '' } `}><i className="fa fa-save"></i> Save</button>
                                            {
                                                this.props.match.params.questionNumber < this.state.listOfNumber.length?
                                                    <button onClick={async() => await this.onPage('next')} className="btn btn-info ml-4"><i className="fa fa-arrow-right"></i> Next</button>
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

export default QuizContestQuestions;