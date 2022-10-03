import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { downloadCertificate, getMyCourses } from "../../api/Courses";
import { getPersonalInfo } from "../../api/Helper";
import moment from "moment";
import $ from "jquery";
import DetailCourse from "./DetailCourses";
import { getFirstLesson } from "../../api/Lessons";

class MyCourses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courseId : '',
            myCourses : []
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        const myCourses = await getMyCourses(Cookies.get('userId'));
        this.setState({ myCourses : myCourses.data });
    }

    async handleMyCourse(status, courseId) {
        // if(status == 'In Progress') {
        const firstLesson = await getFirstLesson(courseId);
        this.props.history.push(`/home/learning/${courseId}/lesson/${firstLesson.data.id}`);
        // }
    }

    async detailCourse(courseId){
        this.setState({ courseId : courseId });
    }

    // async downloadCertificate(code) {
    //     await downloadCertificate(code);
    // }

    render() {
        return(
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>My Courses</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">My Courses</div>
                        </div>
                    </div>
                    <div className="section-body">
                        {
                            this.state.myCourses.length == 0 ? 
                                <div><h5 className="text-center">No courses available</h5></div>
                            :
                            ''
                        }
                        <div className="row">
                            <div className="col-12 col-md-4 col-lg-4">
                                { this.state.myCourses.map((myCourse, i) => {
                                    return (
                                        <article key={i} className="article article-style-c">
                                            <div className="article-details">
                                                <div className="article-category">
                                                    <a>Due Date : { moment(new Date(myCourse.course.due_date)).format('DD MMMM Y')}</a>
                                                </div>
                                                <div className="article-title">
                                                    <h2>
                                                        <a href="#" onClick={async() => await this.detailCourse(myCourse.course.id)}>
                                                            {myCourse.course.course_name}
                                                        </a>
                                                    </h2>
                                                </div>
                                                <p>
                                                    {myCourse.course.description}
                                                </p>
                                                <div className="text-bold">Progress: </div>
                                                <div className="progress mb-3">
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={myCourse.progress > 0 ? {
                                                            width : `${myCourse.progress}%`
                                                        } : {}}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >{myCourse.progress}%</div>
                                                </div>
                                                <div className="article-user">
                                                    <img
                                                        alt="image"
                                                        src="../../assets/img/avatar/avatar-1.png"
                                                    />
                                                    <div className="article-user-details">
                                                        <div className="user-detail-name">
                                                            <a href="#">{ myCourse.course.user.name }</a>
                                                        </div>
                                                        <div className="text-job">{ myCourse.course.organization.organization_name }</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={async(e) => this.handleMyCourse(myCourse.status, myCourse.course.id)} 
                                                    className={`btn btn-primary my-3 w-100${ myCourse.status == 'Done' ? ' disabled' : '' }`}>
                                                    {
                                                        myCourse.status == 'In Progress' ? 'Continue Learning' :  'You Have Finishied This Course'
                                                    }
                                                </button>
                                                {
                                                    myCourse.certificate != null ?
                                                        <a 
                                                            className="btn btn-primary my-1 w-100"
                                                            href={`http://localhost:3001/certificate/${myCourse.certificate.code}`}
                                                            target="_blank"
                                                        >
                                                            <i className="fa fa-download"></i> Download Certificate
                                                        </a>
                                                    :
                                                    ''
                                                }
                                            </div>
                                        </article>
                                    )
                                }) }
                            </div>
                            <DetailCourse
                                courseId={this.state.courseId}
                                onCloseModal={() => this.setState({ courseId : '' })}
                            />
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default MyCourses;