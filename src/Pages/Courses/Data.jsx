import React, { Component } from "react";
import { deletedCourse, getCourse, getCourseById, updateCourse } from "../../api/Courses";
import $ from "jquery";
import moment from "moment";
import iziToast from "izitoast";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import swal from "sweetalert";
import { creteCourse } from "../../api/Courses";
import Cookies from "js-cookie";
import { getOrganization } from "../../api/Organization";

class CoursesData extends Component {   
    
    constructor(props){
        super(props);
        this.state = {
            courses : [],
            isLoading : false,
            onSubmit : false,
            courseName : '',
            org : '',
            orgName : '',
            orgData : [],
            dueDate : '',
            idCourse : '',
            titleModal : 'Create Course'
        }
    }

    async initModal() {
        $('#modalCourse').modal('show');
        const data = await getOrganization();
        this.setState({ orgData : data.data });
    }

    async saveCourse() {
        try {
            this.setState({ onSubmit : true });
            const data = {
                course_name : this.state.courseName,
                organization : this.state.org,
                due_date : this.state.dueDate,
                created_by : Cookies.get('userId')
            };
            setTimeout(async() => {
                var save;
                if(this.state.idCourse == ''){
                    save = await creteCourse(data);
                }else{
                    save = await updateCourse(data, this.state.idCourse);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                    await this.closeModal();
                    await this.getData();
                }else{
                    iziToast.warning({
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        } catch(err) {
            iziToast.error({
                message: handleMessage(err.response.data.message),
                position: "topRight",
            });
        }
    }

    async Loading() {
        this.setState({ isLoading : true });
        setTimeout(() => {
            this.setState({ isLoading : false });
        }, 200);
    }

    async getData(){
        const courses = await getCourse();
        this.setState({ courses : courses.data });
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.Loading();
        await this.getData();
        $("#dataTable").DataTable({
            order : [['0', 'desc']],
            pageLength : 10
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.idCourse != this.state.idCourse && this.state.idCourse != ''){
            await this.initModal();
            const getCourse = await getCourseById(this.state.idCourse);
            this.setState({ titleModal : 'Update Course' });
            this.setState({ courseName : getCourse.data.course_name });
            this.setState({ org : getCourse.data.organization.organization_code });
            this.setState({ orgName : getCourse.data.organization.organization_name });
            this.setState({ dueDate : getCourse.data.due_date });
        }
    }

    async updateCourse() {

    }

    async deleteCourse(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this course",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if (willDelete) {
                const deleted = await deletedCourse(id);
                if(deleted.is_error == false){
                    await this.getData();
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

    async closeModal() {
        this.setState({ 
            courseName : '',
            org : '',
            orgName : '',
            dueDate : '',
            idCourse : '',
            titleModal : 'Create Course'
        });
        $("#modalCourse").modal('hide');
    }

    async refreshData(){
        await this.getData();
    }

    render () {
        const { courses } = this.state;
        return (
            <div className="table-responsive">
                <p className={`text-center${this.state.isLoading ? ' d-block' : ' d-none' }`}>
                    <i className="fa fa-spinner fa-spin"></i> Loading...
                </p>
                <button onClick={async() => await this.initModal()} className="btn btn-primary mb-4"><i className="fa fa-plus"></i> 
                        &nbsp;Create Course
                </button>
                <table className="table table-striped" id="dataTable">
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Organization</th>
                            <th>Due Date</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, i) => {
                            let tbody;
                            tbody = (
                                <tr key={i}>
                                    <td>{course.id}</td>
                                    <td>{course.course_name}</td>
                                    <td>{course.organization.organization_name}</td>
                                    <td>{course.due_date}</td>
                                    <td>{ moment(course.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                    <td>{ moment(course.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                    <td>
                                        <button className="btn btn-primary ml-2 w-100" onClick={async() => await this.setState({ idCourse : course.id }) }>Update</button>
                                        <button className="btn btn-danger ml-2 my-1 w-100"  onClick={async() => await this.deleteCourse(course.id) }>Delete</button>
                                    </td>
                                </tr>
                            );
                            return tbody;
                        })}
                    </tbody>
                </table>
                <div id="modalCourse" className="modal fade shadow-lg my-5" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                    <label>Course Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Course Name..."
                                        value={ this.state.courseName }
                                        onChange={(e) => this.setState({ courseName : e.target.value }) }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Organization</label>
                                    <select
                                        className="form-control"
                                        placeholder="Select Organization"
                                        value={this.state.org}
                                        onChange={(e) => this.setState({ org : e.target.value }) }
                                    >
                                    <option value="">Select Organization</option>
                                    {this.state.orgData.map((organization, key) => {
                                        return (
                                        <option key={key} value={organization.organization_code}>{organization.organization_name}</option>
                                        )
                                    })
                                    }
                                    </select>
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
                            </form>
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={async() => await this.saveCourse()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CoursesData;