import React, { Component } from "react";
import $ from "jquery";
import { getLessonByCourse } from "../../api/Lessons";
import { getExamByCourse } from "../../api/Exams";
import { getQuizByCourse } from "../../api/Quiz";

class DetailCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz : [],
            exams : [],
            lessons : [],
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.courseId != this.props.courseId && this.props.courseId != ''){
            await this.detailCourse(this.props.courseId);
        }
    }

    async closeModal() {
        this.props.onCloseModal();
        $("#detailCourse").modal('hide');
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

        return(
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
        )
    }
}

export default DetailCourse;