import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { getCourse } from "../../api/Courses";
import { createExam, deleteExam, getExamById, getExams, updateExam } from "../../api/Exams";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import Cookies from "js-cookie";
import { getPermission } from "../../api/Users";

class Exams extends Component {

    constructor(props){
        super(props);
        this.state = {
            examId : '',
            examIdRadio : '',
            title : '',
            courseId : '',
            description : '',
            examTime : '',
            numberOfQuestion : '',
            passingGrade : '',
            examsData : [],
            coursesData : [],
            onSubmit : false,
            titleModal : 'Create Exam',
            btnCreateQuestion : false,
            permission : []
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.getExams();
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
        if(prevState.examId != this.state.examId && this.state.examId != ''){
            const exam = await getExamById(this.state.examId);
            this.setState({
                title : exam.data.title,
                courseId : exam.data.course_id,
                description : exam.data.description,
                examTime : exam.data.exam_time,
                numberOfQuestion : exam.data.number_of_question,
                passingGrade : exam.data.passing_grade,
                titleModal : 'Update Exam'
            });
            await this.initModal();
        }
    }

    async initModal() {
        const courses = await getCourse();
        this.setState({ coursesData : courses.data });
        $("#modalExam").modal('show');
    }

    async getExams() {
        const exams = await getExams();
        this.setState({ examsData : exams.data });
    }

    async closeModal() {
        this.setState({
            examId : '',
            title : '',
            courseId : '',
            description : '',
            examTime : '',
            numberOfQuestion : '',
            passingGrade : '',
            titleModal : 'Create Exam'
        });
        $("#modalExam").modal('hide');
    }

    async saveExam() {
        try {
            const data = {
                title : this.state.title,
                course_id : this.state.courseId,
                description : this.state.description,
                exam_time : this.state.examTime,
                number_of_question : this.state.numberOfQuestion,
                created_by : Cookies.get('userId'),
                passing_grade : this.state.passingGrade
            }
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.examId != ''){
                    save = await updateExam(data, this.state.examId);
                }else { 
                    save = await createExam(data);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                    await this.getExams();
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

    async deleteExam(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this exam",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteExam(id);
                if(deleted.is_error == false){
                    await this.getExams();
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

    onCreateQuestion (examId){
        this.setState({
            btnCreateQuestion : true,
            examIdRadio : examId
        });
    }

    render() {

        const { examsData, coursesData } =  this.state;

        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                    <h1>Exams</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Manage Exams</div>
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
                                                &nbsp;Create Exam
                                            </button>
                                            : ''
                                        }
                                        {
                                            this.state.btnCreateQuestion && this.state.permission.includes('Update') ? 
                                                <Link to={`/home/exams/${this.state.examIdRadio}/1`} className="ml-2 btn btn-info mb-4"><i className="fa fa-edit"></i> 
                                                    &nbsp;Exam Question
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
                                                        <th>Pass. Grade</th>
                                                        <th>Created At</th>
                                                        <th>Updated At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        examsData.map((exam, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td><input type="radio" name="radio" onClick={() => this.onCreateQuestion(exam.id)} /></td>
                                                                    <td>{exam.id}</td>
                                                                    <td>{exam.title}</td>
                                                                    <td>{exam.course.course_name}</td>
                                                                    <td>{exam.course.organization.organization_name}</td>
                                                                    <td>{exam.exam_time +' Minutes'}</td>
                                                                    <td>{exam.number_of_question}</td>
                                                                    <td>{exam.passing_grade}</td>
                                                                    <td>{ moment(exam.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(exam.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>
                                                                        {
                                                                            this.state.permission.includes('Update') ?
                                                                            <button
                                                                                className="btn btn-primary w-100 my-2"
                                                                                onClick={(e) => this.setState({ examId : exam.id }) }
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
                                                                                onClick={async(e) => await this.deleteExam(exam.id) }
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
                                        <div id="modalExam" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                    value={this.state.examTime}
                                                                    onChange={(e) => this.setState({ examTime : e.target.value }) }
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
                                                            <div className="form-group">
                                                                <label>Passing Grade</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ this.state.passingGrade }
                                                                    onChange={(e) => this.setState({ passingGrade : e.target.value }) }
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={async() => await this.saveExam()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
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

export default Exams;