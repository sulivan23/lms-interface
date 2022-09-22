import React, { Component } from "react";
import { getListContent } from "../../api/Learning";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

class ListOfContent extends Component {

    constructor(props){
        super(props);
        this.state = {
            lessonDetailId : '',
            quizId : '',
            examId : '',
            lessonContent : [],
            listQuiz : [],
            listExams : [],
            number : 0
        }
    }

    async componentDidMount() {
        await this.getContent();
    }

    async getContent() {
        const content = await getListContent(Cookies.get('userId'), this.props.courseId);
        this.setState({
            lessonContent : content.data.lessons,
            listQuiz : content.data.quiz,
            listExams : content.data.exams,
            number : 1
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.number != this.state.number){
            this.setState({ number : 1 });
        }
        if(prevProps.refreshContent == false && this.props.refreshContent == true && this.props.type == 'lesson'){
            await this.getContent();
            this.props.onRefreshContent(false);
        }
    }

    render() {
        
        const { lessonContent, listQuiz, listExams } = this.state;
        var count = 1;

        return (
            <div>
                <div className="card">
                    <div className="card-header bg-light">
                        <h4 className="text-dark">List Of Contents</h4>
                    </div>
                    <div className="card-body" style={{ marginTop : '-15px' }}>

                        <ul className="nav nav-pills flex-column sidebar-menu w-100" style={{ maxHeight : '1000px', overflow : 'scroll' }}>
                            <li className="mb-2"><label className="shadow-md bg-light w-100 text-dark p-1 mr-2">Lessons</label></li>
                            {
                                lessonContent.map((lesson, key) => {
                                    var number = count++;
                                    this.props.setCourseEmp(lesson.course.course_employee_id)
                                    return (
                                        <li className="nav-link">
                                            <li className="nav-link" style={{ fontSize : '17px', marginLeft : '-20px', marginTop : '-20px' }}>{number}{'. '+lesson.lesson_title}</li>
                                            <ul className="list-group list-group-flush">
                                                {
                                                    lesson.lessons_details.map((detail, i) => {
                                                        return (
                                                            <li 
                                                                className={`list-group-item${ this.props.type == 'lesson'
                                                                                            && this.props.id == lesson.id ? ' active' : '' }`} 
                                                                style={{ marginTop : '-10px' }}>
                                                                {number}.{i+1} {' '}
                                                                <Link 
                                                                    to={`/home/learning/${this.props.courseId}/lesson/${lesson.id}`} 
                                                                    className={`shadow-md ${ this.props.type == 'lesson'
                                                                                && this.props.id == lesson.id ? ' text-white' : 'text-primary' }`}
                                                                >
                                                                    { detail.lesson_detail_title }
                                                                </Link>
                                                                {' '}
                                                                {
                                                                    lesson.course.status_lesson != null 
                                                                        ? <i className="fa fa-check"></i>
                                                                    :
                                                                    ''
                                                                }
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </li>
                                    )
                                }) 
                            }
                            <li className="mb-2"><label className="shadow-md bg-light w-100 text-dark p-1 mr-2">Quiz</label></li>
                            {
                                listQuiz.map((quiz, key) => {
                                    return (
                                        <li className="nav-link">
                                            <li 
                                                className={`nav-link${this.props.type == 'quiz'
                                                                    && this.props.id == quiz.id ? ' active' : '' }`} 
                                                style={{ fontSize : '15px', marginLeft : '-20px', marginTop : '-20px' }}>
                                                {count++} 
                                                {'. '}  
                                                <Link 
                                                    to={`/home/learning/${this.props.courseId}/quiz/${quiz.id}`}
                                                    className={`shadow-md ${this.props.type == 'quiz' 
                                                                        && this.props.id == quiz.id ? ' text-white' : 'text-primary'}`}>
                                                    {quiz.title}
                                                </Link>
                                            </li>
                                        </li>
                                    )
                                }) 
                            }
                            <li className="mb-2"><label className="shadow-md bg-light w-100 text-dark p-1 mr-2">Exams</label></li>
                            {
                                listExams.map((exam, key) => {
                                    return (
                                        <li className="nav-link">
                                            <li className={`nav-link${this.props.type == 'exam'
                                                                    && this.props.id == exam.id ? ' active' : '' }`} 
                                                style={{ fontSize : '15px', marginLeft : '-20px', marginTop : '-20px' }}>
                                                {count++} 
                                                {'. '}  
                                                <Link 
                                                    to={`/home/learning/${this.props.courseId}/exam/${exam.id}`}
                                                    className={`shadow-md ${this.props.type == 'exam' 
                                                                        && this.props.id == exam.id ? ' text-white' : ' text-primary'}`}>
                                                    {exam.title}
                                                </Link>
                                            </li>
                                        </li>
                                    )
                                }) 
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListOfContent;