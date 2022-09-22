import React, { Component } from "react";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast";
import moment from "moment";
import { getPersonalInfo, handleMessage } from "../../../api/Helper";
import Cookies from "js-cookie";
import { getPermission } from "../../../api/Users";
import { Link } from "react-router-dom";
import { createQuizContest, deleteQuizContest, getPrizeByQuizContest, getQuizContest, getQuizContestById, updateQuizContest } from "../../../api/QuizContest";
import { deleteQuiz } from "../../../api/Quiz";

class QuizContest extends Component {

    constructor(props){
        super(props);
        this.state = {
            quizContestId : '',
            quizContestIdRadio : '',
            title : '',
            description : '',
            quizTime : '',
            dueDate : '',
            numberOfQuestion : '',
            quizContest : [],
            winnerType : ['Juara 1', 'Juara 2', 'Juara 3', 'Juara Favorit'],
            prize : [],
            permission : [],
            titleModal : 'Create Quiz Contest',
            onSubmit : false
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.getQuizContest();
        const permission = await getPermission({
            role : Cookies.get('role'),
            type : 'Menu',
            url : this.props.location.pathname
        });
        if(permission.data == null){
            return this.props.history.push('/home/404');  
        }
        this.setState({ permission : permission.data.permission.split(', ') });
        $("#dataTable").DataTable({
            order : [['1', 'desc']],
            pageLength : 10
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.quizContestId != this.state.quizContestId && this.state.quizContestId != ''){
            const quizContest = await getQuizContestById(this.state.quizContestId);
            const prizeData = [];
            this.setState({
                title : quizContest.data.title,
                description : quizContest.data.description,
                quizTime : quizContest.data.quiz_time,
                dueDate : quizContest.data.due_date,
                numberOfQuestion : quizContest.data.number_of_question,
                titleModal : 'Update Quiz Contest'
            });
            const prize = await getPrizeByQuizContest(this.state.quizContestId);
            prize.data.map((prizes, i) => {
                prizeData.push({ 
                    winner_type : prizes.winner_type,
                    prize_description : prizes.prize_description
                });
            });
            this.setState({ prize : prizeData });
            await this.initModal();
        }
    }

    async initModal(){
        $("#modalQuizContest").modal('show');
    }

    async closeModal() {
        this.setState({
            title : '',
            description : '',
            quizTime : '',
            dueDate : '',
            numberOfQuestion : '',
            quizContestId : '',
            prize : [],
            titleModal : 'Create Quiz Contest'
        });
        $("#modalQuizContest").modal('hide');
    }

    async saveQuizContest() {
        try {
            const data = {
                title : this.state.title,
                description : this.state.description,
                quiz_time : this.state.quizTime,
                due_date : this.state.dueDate,
                number_of_question : this.state.numberOfQuestion,
                created_by : Cookies.get('userId'),
                prize : this.state.prize
            };
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.quizContestId != ''){
                    save = await updateQuizContest(data, this.state.quizContestId);
                }else { 
                    save = await createQuizContest(data);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                    await this.getQuizContest();
                    await this.closeModal();
                }else {
                    iziToast.warning({
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        } catch(err){
            console.log(err);
        }
    }

    async deleteQuizContest(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this quiz contest",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteQuizContest(id);
                if(deleted.is_error == false){
                    await this.getQuizContest();
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

    async getQuizContest() {
        const quizContest = await getQuizContest();
        this.setState({ quizContest : quizContest.data });
    }

    onCreateQuestion (quizContestId){
        this.setState({
            btnCreateQuestion : true,
            quizContestIdRadio : quizContestId
        });
    }

    onChangePrize(winnerType, prizeDescription) {
        var arrValue = this.state.prize;
        var foundIndex = arrValue.findIndex(x => x.winner_type == winnerType);
        if(foundIndex >= 0){
            if(prizeDescription != ''){
                arrValue[foundIndex].prize_description = prizeDescription;
            }else{
                arrValue.splice(foundIndex, 1);
            }
        }else{
            arrValue = [...arrValue, {
                winner_type : winnerType,
                prize_description : prizeDescription
            }];
        }
        this.setState({ prize : arrValue });
    }

    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                    <h1>Quiz Contest</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Manage Quiz Contest</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        {
                                            this.state.permission.includes('Create') ?
                                            <button onClick={async() => await this.initModal()} className="btn btn-primary mb-4"><i className="fa fa-plus"></i> 
                                                &nbsp;Create Quiz Contest
                                            </button>
                                            : ''
                                        }
                                        {
                                            this.state.btnCreateQuestion && this.state.permission.includes('Update') ? 
                                                <Link to={`/home/quiz_contest/${this.state.quizContestIdRadio}/1`} className="ml-2 btn btn-info mb-4"><i className="fa fa-edit"></i> 
                                                    &nbsp;Quiz Contest Question
                                                </Link>
                                            :
                                            ''
                                        }
                                        <div className="table table-responsive">
                                            <table className="table table-striped" id="dataTable">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>ID</th>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>Time</th>
                                                        <th>Due Date</th>
                                                        <th>NOQ</th>
                                                        <th>Created At</th>
                                                        <th>Updated At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.quizContest.map((quizContest, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td><input type="radio" name="radio" onClick={() => this.onCreateQuestion(quizContest.id)} /></td>
                                                                    <td>{quizContest.id}</td>
                                                                    <td>{quizContest.title}</td>
                                                                    <td>{quizContest.description}</td>
                                                                    <td>{quizContest.quiz_time +' Minutes'}</td>
                                                                    <td>{quizContest.due_date}</td>
                                                                    <td>{quizContest.number_of_question}</td>
                                                                    <td>{ moment(quizContest.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(quizContest.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>
                                                                        {
                                                                            this.state.permission.includes('Update') ?
                                                                            <button
                                                                                className="btn btn-primary w-100 my-2"
                                                                                onClick={(e) => this.setState({ quizContestId : quizContest.id }) }
                                                                            >
                                                                                Update
                                                                            </button>
                                                                            :
                                                                            ''
                                                                        }
                                                                        {
                                                                            this.state.permission.includes('Delete') ?
                                                                            <button
                                                                                className="btn btn-danger w-100 my-1 mb-2"
                                                                                onClick={async(e) => await this.deleteQuizContest(quizContest.id) }
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                            :
                                                                            ''
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div id="modalQuizContest" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">{this.state.titleModal}</h5>
                                                    <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form>
                                                            <div className="form-group">
                                                                <label>Title</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Title..."
                                                                    value={ this.state.title }
                                                                    onChange={(e) => this.setState({ title : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Description</label>
                                                                <textarea
                                                                    height="250"
                                                                    width="500"
                                                                    className="form-control"
                                                                    onChange={(e) => this.setState({ description : e.target.value })}
                                                                    placeholder="Description..."
                                                                    value={this.state.description}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Time (Minutes)</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={this.state.quizTime}
                                                                    onChange={(e) => this.setState({ quizTime : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Due Date</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={this.state.dueDate}
                                                                    onChange={(e) => this.setState({ dueDate : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Number Of Question</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ this.state.numberOfQuestion }
                                                                    onChange={(e) => this.setState({ numberOfQuestion : e.target.value }) }
                                                                />
                                                            </div>
                                                            {
                                                                this.state.winnerType.map((winnerType, i) => {
                                                                    return (
                                                                        <div className="row">
                                                                            <div class="col-6">
                                                                                <div className="form-group">
                                                                                    <label>Winner Type</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={winnerType}
                                                                                        disabled
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-6">
                                                                                <div className="form-group">
                                                                                    <label>Type The Prize</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Prize..."
                                                                                        value={this.state.prize.filter((item) => {
                                                                                            return item.winner_type == winnerType
                                                                                        }).map((result) => {
                                                                                            return result.prize_description
                                                                                        })}
                                                                                        onChange={(e) => this.onChangePrize(winnerType, e.target.value) }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={async() => await this.saveQuizContest()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
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

export default QuizContest;