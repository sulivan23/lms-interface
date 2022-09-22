import React, { Component } from "react";
import $ from "jquery";
import iziToast from "izitoast";
import swal from "sweetalert";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import moment from "moment";
import { createLesson, deleteLesson, getLesson, getLessonById, getLessonContentByLesson, updateLesson } from "../../api/Lessons";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { getCourse } from "../../api/Courses";
import SubLessons from "./SubLessons";
import { getPermission } from "../../api/Users";

class Lessons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lesson_id : '',
            course_id : '',
            lesson_title : '',
            onSubmit : false,
            lesson : [],
            course : [],
            titleModal : 'Create Lesson',
            lessonContent : [],
            loadingLessonContent : false,
            lesson_id_content : '',
            permission : []
        };
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.getLesson();
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

    async componentDidUpdate(prevProps, prevState){
        if(prevState.lesson_id != this.state.lesson_id && this.state.lesson_id != ''){
            const lesson = await getLessonById(this.state.lesson_id);
            this.setState({
                course_id : lesson.data.course_id,
                lesson_title : lesson.data.lesson_title
            });
            await this.initModal();
        }
    }

    async getLesson() {
        const lessons = await getLesson();
        this.setState({ lesson : lessons.data });
    }

    async initModal(){
        const course = await getCourse();
        this.setState({ course : course.data });
        $("#modalLesson").modal('show');
    }

    async closeModal() {
        $("#modalLesson").modal('hide');
        this.setState({
            lesson_id : '',
            course_id : '',
            lesson_title : '',
            titleModal : 'Create Lesson'
        });
    }

    async deleteLesson(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this lesson",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteLesson(id);
                if(deleted.is_error == false){
                    await this.getLesson();
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

    async saveLesson() {
        try {
            const data = {
                lesson_title : this.state.lesson_title,
                course_id : this.state.course_id,
                created_by : Cookies.get('userId')
            };
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.lesson_id != ''){
                    save = await updateLesson(data, this.state.lesson_id);
                }else{
                    save = await createLesson(data);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                    await this.closeModal();
                    await this.getLesson();
                }else{
                    iziToast.warning({
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        }catch(err){
            console.log(err);
        }
    }

    async getLessonContent(lesson) {
        this.setState({ loadingLessonContent : true });
        setTimeout(async() => {
            const lessonContent = await getLessonContentByLesson(lesson);
            this.setState({ lessonContent : lessonContent.data });
            this.setState({ loadingLessonContent : false });
            this.setState({ lesson_id_content : lesson });
        }, 1000);
    }

    render() {

        const { lesson, course } = this.state;

        return (
                <div className="main-content">
                    <section className="section">
                        <div className="section-header">
                            <h1>Manage Lessons</h1>
                            <div className="section-header-breadcrumb">
                                <div className="breadcrumb-item active">
                                    <Link to="/home">Dashboard</Link>
                                </div>
                                <div className="breadcrumb-item">Courses</div>
                                <div className="breadcrumb-item">Manage Lessons</div>
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
                                                    &nbsp;Create Lesson
                                                </button>
                                                :
                                                ''
                                            }
                                            <div className="table table-responsive">
                                                <table className="table table-striped" id="dataTable">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>ID</th>
                                                            <th>Course</th>
                                                            <th>Title</th>
                                                            <th>Organization</th>
                                                            <th>Created At</th>
                                                            <th>Updated At</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            lesson.map((les, i) => {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>
                                                                            <input key={i} type="radio" name="radio" onClick={async() => this.getLessonContent(les.id) } />                                                                        </td>
                                                                        <td>{les.id}</td>
                                                                        <td>{les.course.course_name}</td>
                                                                        <td>{les.lesson_title}</td>
                                                                        <td>{les.course.organization.organization_name}</td>
                                                                        <td>{ moment(les.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                        <td>{ moment(les.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                        <td>
                                                                            {
                                                                                this.state.permission.includes('Update') ?
                                                                                <button
                                                                                    className="btn btn-primary w-100 my-2"
                                                                                    onClick={(e) => this.setState({ lesson_id : les.id }) }
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
                                                                                    onClick={async(e) => await this.deleteLesson(les.id) }
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
                                            <div id="modalLesson" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                    <label>Lesson Title</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Lesson Title..."
                                                                        value={ this.state.lesson_title }
                                                                        onChange={(e) => this.setState({ lesson_title : e.target.value }) }
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Choose Course</label>
                                                                    <select
                                                                        className="form-control"
                                                                        value={ this.state.course_id }
                                                                        onChange={(e) => this.setState({ course_id : e.target.value }) }
                                                                    >
                                                                        <option value="">Select Course</option>
                                                                        {   course.map((data, i) => {
                                                                                return (
                                                                                    <option key={i} value={data.id}>{data.course_name}</option>
                                                                                )
                                                                            }) 
                                                                        }
                                                                    </select>   
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                            <button type="button" className="btn btn-primary" onClick={async() => await this.saveLesson()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <SubLessons 
                                lessonsContent={this.state.lessonContent} 
                                loadingContent={this.state.loadingLessonContent}
                                onContentChange={async(val) => this.getLessonContent(val)}
                                lessonId={this.state.lesson_id_content} />
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Lessons;