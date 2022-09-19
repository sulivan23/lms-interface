import Cookies from "js-cookie";
import React, { Component } from "react";
import { enrollCourse, getCourse, getCoursesByOrg } from "../../api/Courses";
import { getPersonalInfo } from "../../api/Helper";
import iziToast from "izitoast";
import swal from "sweetalert";
import { handleMessage } from "../../api/Helper";
import $ from "jquery";
import { getLessonByCourse } from "../../api/Lessons";
import { getExamByCourse } from "../../api/Exams";
import { getQuizByCourse } from "../../api/Quiz";

class AvailableCourses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courseId : '',
            courseName : '',
            organization : '',
            createdBy : '',
            createdAt : '',
            dueDate : '',
            onTake : false,
            myOrganizationCode : '',
            courses : [],
            lessons : [],
            exams : [],
            quiz : []
        }
    }

    async componentDidMount() {
        const { user } = await getPersonalInfo();
        this.setState({ myOrganizationCode : user.organization.organization_code });
        await this.getCourses();
    }

    async getCourses() {
        var courses;
        if(Cookies.get('role') == "ADM"){
            courses = await getCourse();
        }else {
            courses = await getCoursesByOrg(this.state.myOrganizationCode);
        }
        this.setState({ courses : courses.data });
    }

    async detailCourse(courseId){
        $("#detailCourse").modal('show');
        const lessons = await getLessonByCourse(courseId);
        const exams = await getExamByCourse(courseId);
        const quiz = await getQuizByCourse(courseId);
        this.setState({
            lessons : lessons.data,
            exams : exams.data,
            quiz : quiz.data
        });
        // e.preventDefault();   
    }

    async takeCourse(courseId) {
        swal({
            title: "Take course",
            text: "Are you sure wanna take this course ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        }).then(async(willTake) => {
            if(willTake){
                const enroll = await enrollCourse({
                    type : "enroll_course",
                    data : {
                        course_id : courseId,
                        employee_id : Cookies.get('userId'),
                        progress :0,
                        status : 'In Progress'
                    }
                });
                if(enroll.is_error == false){
                    return iziToast.success({
                        title: "Success!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }else {
                    return iziToast.error({
                        title: "Error!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }
            }
        });
    }

    async closeModal() {
        $("#detailCourse").modal('hide');
    }

    render() {
        const { exams, lessons, quiz } = this.state;
        var tbody = '';
        if(lessons.length == 0){
            tbody = '<td colspan="5" class="text-center">No data available</td>';
        }
        { 
            lessons.map((les, key) => {
                tbody += `<tr>`;
                var lengthDtl = les.lessons_details.length;
                var noDtl = 1;
                if(lengthDtl > 1){
                        tbody += `<tr>`;
                        tbody += `<td rowspan=${lengthDtl}>${key+1}</td>`;
                        tbody += `<td rowspan=${lengthDtl}>${les.lesson_title}</td>`;
                        les.lessons_details.map((lesDtl, i) => {
                                tbody += `<td>${lesDtl.lesson_detail_title}</td>`;
                                tbody += `</tr>`;
                                // if(noDtl < lengthDtl){
                                //     tbody += '<tr>';
                                // }
                                // noDtl++
                        })
                }
                else{
                        les.lessons_details.map((lesDtl, i) => {
                            tbody += `<td>${key+1}</td>`;
                            tbody += `<td>${les.lesson_title}</td>`;
                            tbody += `<td>${lesDtl.lesson_detail_title}</td>`;
                        }) 
                        tbody += `</tr>`;
                }
            })
        }
        return (
            <div>
                <h2 className="section-title">Available Courses</h2>
                <div className="row">
                    <div className="col-12 col-md-4 col-lg-4">
                        { this.state.courses.map((course, i) => {
                            return (
                                <article key={i} className="article article-style-c">
                                    <div className="article-details">
                                        <div className="article-category">
                                            <a>Due Date : {course.due_date}</a>
                                        </div>
                                        <div className="article-title">
                                            <h2>
                                                <a href="#" onClick={async() => await this.detailCourse(course.id)}>
                                                    {course.course_name}
                                                </a>
                                            </h2>
                                        </div>
                                        {/* <p>
                                            Duis aute irure dolor in reprehenderit in voluptate velit
                                            esse cillum dolore eu fugiat nulla pariatur.{" "}
                                        </p> */}
                                        <div className="article-user">
                                            <img
                                                alt="image"
                                                src="../../assets/img/avatar/avatar-1.png"
                                            />
                                            <div className="article-user-details">
                                                <div className="user-detail-name">
                                                    <a href="#">{ course.user.name }</a>
                                                </div>
                                                <div className="text-job">{ course.organization.organization_name }</div>
                                            </div>
                                        </div>
                                        <button onClick={async(e) => this.takeCourse(course.id)} className="btn btn-primary my-3 w-100">Take Courses</button>
                                    </div>
                                </article>
                            )
                        }) }
                    </div>
                    <div id="detailCourse" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Detail Course</h5>
                                    <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div class="col-12">
                                        <div class="card shadow-md ">
                                            <div class="card-header bg-primary">
                                                <h4 class="text-white">Materi</h4>
                                            </div>
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-12 col-sm-12 col-md-4">
                                                        <ul
                                                            class="nav nav-pills flex-column"
                                                            id="myTab4"
                                                            role="tablist"
                                                        >
                                                            <li class="nav-item">
                                                                <a
                                                                    class="nav-link active"
                                                                    id="home-tab4"
                                                                    data-toggle="tab"
                                                                    href="#lessons"
                                                                    role="tab"
                                                                    aria-controls="home"
                                                                    aria-selected="true"
                                                                >
                                                                    Materi Pembelajaran
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a
                                                                    class="nav-link"
                                                                    id="profile-tab4"
                                                                    data-toggle="tab"
                                                                    href="#exams"
                                                                    role="tab"
                                                                    aria-controls="profile"
                                                                    aria-selected="false"
                                                                >
                                                                    Ujian
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a
                                                                    class="nav-link"
                                                                    id="contact-tab4"
                                                                    data-toggle="tab"
                                                                    href="#quiz"
                                                                    role="tab"
                                                                    aria-controls="contact"
                                                                    aria-selected="false"
                                                                >
                                                                    Quiz
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div class="col-12 col-sm-12 col-md-8">
                                                        <div class="tab-content no-padding" id="myTab2Content">
                                                            <div
                                                                class="tab-pane fade show active"
                                                                id="lessons"
                                                                role="tabpanel"
                                                                aria-labelledby="home-tab4"
                                                            >
                                                                <div class="table table-responsive">
                                                                    <table class="table table-bordered">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>No</th>
                                                                                <th>Lessons</th>
                                                                                <th>Content</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody dangerouslySetInnerHTML={{ __html : tbody }}>
                                                                            {/* {lessons.length == 0 ? 
                                                                                <tr>
                                                                                    <td colSpan={3} className="text-center">No available</td>
                                                                                </tr>
                                                                            :  ''} */}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div
                                                                class="tab-pane fade"
                                                                id="exams"
                                                                role="tabpanel"
                                                                aria-labelledby="profile-tab4"
                                                            >
                                                                <div class="table table-responsive">
                                                                    <table className="table table-striped">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>No</th>
                                                                                <th>Title</th>
                                                                                <th>Time</th>
                                                                                <th>NOQ</th>
                                                                                <th>Passing Grade</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                exams.map((exam, key) => {
                                                                                    return (
                                                                                        <tr key={key}>
                                                                                            <td>{key+1}</td>
                                                                                            <td>{exam.title}</td>
                                                                                            <td>{`${exam.exam_time} Minutes`}</td>
                                                                                            <td>{`${exam.number_of_question} Questions`}</td>
                                                                                            <td>{`${exam.passing_grade} Point`}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
                                                                            {exams.length == 0 ? 
                                                                                <tr>
                                                                                    <td colSpan={5} className="text-center">No available</td>
                                                                                </tr>
                                                                            :  ''}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div
                                                                class="tab-pane fade"
                                                                id="quiz"
                                                                role="tabpanel"
                                                                aria-labelledby="contact-tab4"
                                                            >
                                                                <div class="table table-responsive">
                                                                    <table className="table table-striped">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>No</th>
                                                                                <th>Title</th>
                                                                                <th>Time</th>
                                                                                <th>NOQ</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                quiz.map((kuis, key) => {
                                                                                    return (
                                                                                        <tr key={key}>
                                                                                            <td>{key+1}</td>
                                                                                            <td>{kuis.title}</td>
                                                                                            <td>{kuis.quiz_time}</td>
                                                                                            <td>{kuis.number_of_question}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
                                                                            {quiz.length == 0 ? 
                                                                                <tr>
                                                                                    <td colSpan={4} className="text-center">No available</td>
                                                                                </tr>
                                                                            :  ''}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AvailableCourses;