import Cookies from "js-cookie";
import React, { Component } from "react";
import { getMyExams } from "../../api/Exams";
import { getPersonalInfo } from "../../api/Helper";
import { Link } from "react-router-dom";

class MyExams extends Component { 

    constructor(props){
        super(props);
        this.state = {
            myExams : []
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        const myExams = await getMyExams(Cookies.get('userId'));
        this.setState({ myExams : myExams.data });
    }

    async handleMyExam() {

    }

    render() {
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
                                                    <a>Status : {myExam.course.status_exams == null ? 'Not Started' : MyExams.course.status_exams}</a>
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
                                                <button 
                                                    onClick={async(e) => this.handleMyExam(myExam.id)} 
                                                    className={`btn btn-primary my-3 w-100${ myExam.course.status_exams == 'Done' ? ' disabled' : '' }`}>
                                                    {
                                                        myExam.course.status_exams == null ? 'Start Exam' : (myExam.course.status_exams == 'In Progress' ? 'Continue Exam' : 'You have finished this exam') 
                                                    }
                                                </button>
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