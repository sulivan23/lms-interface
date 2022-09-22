import Cookies from "js-cookie";
import React, { Component } from "react";
import { getPersonalInfo } from "../../api/Helper";
import { Link } from "react-router-dom";
import { getMyQuiz } from "../../api/Quiz";

class MyQuiz extends Component { 

    constructor(props){
        super(props);
        this.state = {
            myQuiz : []
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        const myQuiz = await getMyQuiz(Cookies.get('userId'));
        this.setState({ myQuiz : myQuiz.data });
    }

    async handleMyQuiz() {

    }

    render() {
        return(
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>My Quiz</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">My Quiz</div>
                        </div>
                    </div>
                    <div className="section-body">
                        {
                            this.state.myQuiz.length == 0 ? 
                                <div>
                                    <h5 className="text-center">No quiz available</h5>
                                </div> 
                            : ''
                        }
                        <div className="row">
                            <div className="col-12 col-md-4 col-lg-4">
                                { this.state.myQuiz.map((quiz, i) => {
                                    return (
                                        <article key={i} className="article article-style-c">
                                            <div className="article-details">
                                                <div className="article-category">
                                                    <a>Status : {quiz.course.status_quiz == null ? 'Not Started' : quiz.course.status_quiz}</a>
                                                </div>
                                                <div className="article-title">
                                                    <h2>
                                                        <a href="#">
                                                            {quiz.title}
                                                        </a>
                                                    </h2>
                                                </div>
                                                <div className="text-bold">
                                                    Duration : 
                                                    <p class="text-job">{quiz.quiz_time} Minutes</p>
                                                </div>
                                                <div className="text-bold">
                                                    Number Of Question : 
                                                    <p class="text-job">{quiz.number_of_question} Questions</p>
                                                </div>
                                                <div className="article-user" style={{
                                                    marginTop : '-10px'
                                                }}>
                                                    <div className="article-user-details">
                                                        <div className="user-detail-name">
                                                            Course Name : <a href="#">{ quiz.course.course_name }</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={async(e) => this.handleMyQuiz(quiz.id)} 
                                                    className={`btn btn-primary my-3 w-100${ quiz.course.status_quiz == 'Done' ? ' disabled' : '' }`}>
                                                    {
                                                        quiz.course.status_quiz == null ? 'Start Quiz' : (quiz.course.status_quiz == 'In Progress' ? 'Continue Quiz' : 'You have finished this quiz') 
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

export default MyQuiz;