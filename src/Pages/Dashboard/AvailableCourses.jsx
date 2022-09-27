import Cookies from "js-cookie";
import React, { Component } from "react";
import { enrollCourse, getCourse, getCoursesByOrg } from "../../api/Courses";
import { getPersonalInfo } from "../../api/Helper";
import iziToast from "izitoast";
import swal from "sweetalert";
import { handleMessage } from "../../api/Helper";
import $ from "jquery";
import moment from "moment";
import DetailCourse from "../Courses/DetailCourses";
import history from "../../history";
import { withRouter } from "react-router";

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
            quiz : [],
            courseIdDtl : ''
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

    async detailCourse(courseId, e){
        e.preventDefault();
        this.setState({ courseIdDtl : courseId });
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
                    this.props.history.push(`/home/learning/${courseId}/lesson/${enroll.data.first_lesson}`)
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

    render() {
        return (
            <div>
                <h2 className="section-title">Available Courses</h2>
                {
                    this.state.courses.length == 0 ? <div> <p className="text-center">No available courses found</p> </div> : ''
                }
                <div className="row">
                    { this.state.courses.map((course, i) => {
                        return (
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <article key={i} className="article article-style-c">
                                    <div className="article-details" style={{ height : '300px' }}>
                                        <div className="article-category">
                                            <a>Due Date : { moment(new Date(course.due_date)).format('DD MMMM Y')}</a>
                                        </div>
                                        <div className="article-title">
                                            <h2>
                                                <a href="#" onClick={async(e) => await this.detailCourse(course.id, e)}>
                                                    {course.course_name}
                                                </a>
                                            </h2>
                                        </div>
                                        <p>
                                            {course.description}
                                        </p>
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
                            </div>
                        )
                    }) }
                    <DetailCourse
                        courseId={this.state.courseIdDtl}
                        onCloseModal={() => this.setState({ courseIdDtl : '' })}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(AvailableCourses);