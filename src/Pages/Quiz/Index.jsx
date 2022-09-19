import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { getCourse } from "../../api/Courses";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import Cookies from "js-cookie";
import { createQuiz, deleteQuiz, getQuiz, getQuizById, updateQuiz } from "../../api/Quiz";

class Quiz extends Component {

    constructor(props){
        super(props);
        this.state = {
            quizId : '',
            quizIdRadio : '',
            title : '',
            courseId : '',
            quizTime : '',
            numberOfQuestion : '',
            quizData : [],
            coursesData : [],
            onSubmit : false,
            titleModal : 'Create Quiz',
            btnCreateQuestion : false
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.getQuiz();
        $("#dataTable").DataTable({
            order : [['1', 'desc']],
            pageLength : 10
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.quizId != this.state.quizId && this.state.quizId != ''){
            const quiz = await getQuizById(this.state.quizId);
            this.setState({
                title : quiz.data.title,
                courseId : quiz.data.course_id,
                quizTime : quiz.data.quiz_time,
                numberOfQuestion : quiz.data.number_of_question,
                titleModal : 'Update Quiz'
            });
            await this.initModal();
        }
    }

    async initModal() {
        const courses = await getCourse();
        this.setState({ coursesData : courses.data });
        $("#modalQuiz").modal('show');
    }

    async getQuiz() {
        const quiz = await getQuiz();
        this.setState({ quizData : quiz.data });
    }

    async closeModal() {
        this.setState({
            quizId : '',
            title : '',
            courseId : '',
            quizTime : '',
            numberOfQuestion : '',
            titleModal : 'Create Quiz'
        });
        $("#modalQuiz").modal('hide');
    }

    async saveQuiz() {
        try {
            const data = {
                title : this.state.title,
                course_id : this.state.courseId,
                quiz_time : this.state.quizTime,
                number_of_question : this.state.numberOfQuestion,
                created_by : Cookies.get('userId'),
            }
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.quizId != ''){
                    save = await updateQuiz(data, this.state.quizId);
                }else { 
                    save = await createQuiz(data);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                    await this.getQuiz();
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

    async deleteQuiz(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this quiz",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteQuiz(id);
                if(deleted.is_error == false){
                    await this.getQuiz();
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

    onCreateQuestion (quizId){
        this.setState({
            btnCreateQuestion : true,
            quizIdRadio : quizId
        });
    }

    render() {

        const { quizData, coursesData } =  this.state;

        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                    <h1>Quiz</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Manage Quiz</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <button onClick={async() => await this.initModal()} className="btn btn-primary mb-4"><i className="fa fa-plus"></i> 
                                                &nbsp;Create Quiz
                                        </button>
                                        {
                                            this.state.btnCreateQuestion ? 
                                                <Link to={`/home/quiz/${this.state.quizIdRadio}/1`} className="ml-2 btn btn-info mb-4"><i className="fa fa-plus"></i> 
                                                    &nbsp;Create Quiz Question
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
                                                        <th>Course</th>
                                                        <th>Organization</th>
                                                        <th>Time</th>
                                                        <th>NOQ</th>
                                                        <th>Created At</th>
                                                        <th>Updated At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        quizData.map((quiz, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td><input type="radio" name="radio" onClick={() => this.onCreateQuestion(quiz.id)} /></td>
                                                                    <td>{quiz.id}</td>
                                                                    <td>{quiz.title}</td>
                                                                    <td>{quiz.course.course_name}</td>
                                                                    <td>{quiz.course.organization.organization_name}</td>
                                                                    <td>{quiz.quiz_time +' Minutes'}</td>
                                                                    <td>{quiz.number_of_question}</td>
                                                                    <td>{ moment(quiz.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(quiz.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-primary w-100 my-2"
                                                                            onClick={(e) => this.setState({ quizId : quiz.id }) }
                                                                        >
                                                                            Update
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger w-100 my-1 mb-2"
                                                                            onClick={async(e) => await this.deleteQuiz(quiz.id) }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div id="modalQuiz" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                <label>Choose Course</label>
                                                                <select
                                                                    className="form-control"
                                                                    value={ this.state.courseId }
                                                                    onChange={(e) => this.setState({ courseId : e.target.value }) }
                                                                >
                                                                    <option value="">Choose</option>
                                                                    {
                                                                        coursesData.map((course,key) => {
                                                                            return(
                                                                                <option key={key} value={course.id}>{course.course_name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
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
                                                                <label>Number Of Question</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ this.state.numberOfQuestion }
                                                                    onChange={(e) => this.setState({ numberOfQuestion : e.target.value }) }
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={async() => await this.saveQuiz()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
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

export default Quiz;