import Cookies from "js-cookie";
import React, { Component } from "react";
import { getMyExams } from "../../api/Exams";
import { getPersonalInfo } from "../../api/Helper";
import { Link } from "react-router-dom";
import { getPermission } from "../../api/Users";

class MyExams extends Component { 

    constructor(props){
        super(props);
        this.state = {
            myExams : []
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        const permission = await getPermission({
            role : Cookies.get('role'),
            type : 'Menu',
            url : this.props.location.pathname
        });
        if(permission.data == null){
            return this.props.history.push('/home/404');  
        }
        const myExams = await getMyExams(Cookies.get('userId'));
        this.setState({ myExams : myExams.data });
    }

    async handleMyExam(courseId, examId, status) {
        if(status == null) {
            this.props.history.push(`/home/learning/${courseId}/exam/${examId}`);
        }
        else if(status == 'In Progress') {
            this.props.history.push(`/home/exam_answer/${examId}/1`);
        }
    }

    render() {
        console.log(this.state.myExams);
        return(
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>My Exams</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">My Exams</div>
                        </div>
                    </div>
                    <div className="section-body">
                        {
                            this.state.myExams.length == 0 ? 
                                <div>
                                    <h5 className="text-center">No exams available</h5>
                                </div> 
                            : ''
                        }
                        <div className="row">
                            <div className="col-12 col-md-4 col-lg-4">
                                { this.state.myExams.map((myExam, i) => {
                                    return (
                                        <article key={i} className="article article-style-c">
                                            <div className="article-details">
                                                <div className="article-category">
                                                    <a>Status : {myExam.course.status_exams == null ? 'Not Started' : myExam.course.status_exams}</a>
                                                </div>
                                                <div className="article-title">
                                                    <h2>
                                                        <a href="#">
                                                            {myExam.title}
                                                        </a>
                                                    </h2>
                                                </div>
                                                <div className="text-bold">
                                                    Duration : 
                                                    <p class="text-job">{myExam.exam_time} Minutes</p>
                                                </div>
                                                <div className="text-bold">
                                                    Number Of Question : 
                                                    <p class="text-job">{myExam.number_of_question} Questions</p>
                                                </div>
                                                <div className="text-bold">
                                                    Passing Grade : 
                                                    <p class="text-job">{myExam.passing_grade} Point</p>
                                                </div>
                                                <div className="article-user" style={{
                                                    marginTop : '-10px'
                                                }}>
                                                    <div className="article-user-details">
                                                        <div className="user-detail-name">
                                                            Course Name : <a href="#">{ myExam.course.course_name }</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link 
                                                    onClick={async(e) => this.handleMyExam(myExam.course.id, myExam.id, myExam.course.status_exams)} 
                                                    className={`btn btn-primary my-3 w-100${ myExam.course.status_exams == 'Done' ? ' disabled' : '' }`}>
                                                    {
                                                        myExam.course.status_exams == null ? 'Start Exam' : (myExam.course.status_exams == 'In Progress' ? 'Continue Exam' : 'You have finished this exam') 
                                                    }
                                                </Link>
                                            </div>
                                        </article>
                                    )
                                }) }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
       )
    }
}

export default MyExams;