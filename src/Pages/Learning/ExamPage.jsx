import iziToast from "izitoast";
import Cookies from "js-cookie";
import React, { Component } from "react"
import { getMyExamEmpByExam } from "../../api/Exams";
import { handleMessage } from "../../api/Helper";
import { enrollExam } from "../../api/Learning";

class ExamPage extends Component {
    constructor(props){
        super(props);
    }

    async componentDidMount(){
        await this.getExam();
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.examId != this.props.examId && this.propz.examId != ''){
            await this.getExam();
        }
    }

    async getExam() {
        const exam = await getMyExamEmpByExam(this.props.examId, Cookies.get('userId'));
        this.props.onChangeExam(exam.data.title, exam.data.description, exam.data.exam_time, exam.data.number_of_question, '', exam.data.course.score, exam.data.course.status_exams, exam.data.passing_grade, exam.data.course.passed_status);
    }

    async enrollExam() {
        try {
            this.props.handleLoading(true);
            setTimeout(async() => {
                const enroll = await enrollExam(this.props.courseEmployeeId, this.props.examId);
                if(enroll.is_error == false){
                    this.props.onMoveUrl();
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }else{
                    if(enroll.message == 'Gagal, Ujian sudah pernah diambil'){
                        this.props.onMoveUrl();
                    }else{
                        iziToast.warning({
                            title: "Warning!",
                            message: handleMessage(enroll.message),
                            position: "topRight",
                        });
                    }
                }
                this.props.handleLoading(false);
            }, 1000)
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <div className="card-header bg-light text-dark">
                    <h4 className="text-dark">Title : { this.props.contentExam.title }</h4>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Description</label>
                        <p>{this.props.contentExam.description}</p>
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <p>{this.props.contentExam.examTime+ ' Minutes'}</p>
                    </div>
                    <div className="form-group">
                        <label>Number Of Question</label>
                        <p>{this.props.contentExam.numberOfQuestion}</p>
                    </div>
                    <div className="form-group">
                        <label>Passing Grade</label>
                        <p>{this.props.contentExam.passingGrade}{' Point'}</p>
                    </div>
                    <div className="form-group">
                        <label>Exam Status</label>
                        <p>{this.props.contentExam.status == null ? 'Not Started' : this.props.contentExam.status}</p>
                    </div>
                    <div className="form-group">
                        <label>Score</label>
                        <p>{this.props.contentExam.score == null ? 0 : this.props.contentExam.score} Point</p>
                    </div>
                    <div className="form-group">
                        <label>Passed Status</label>
                        <p>{this.props.contentExam.passedStatus ?? 'Not Passed'}</p>
                    </div>
                </div>
                <div className="card-footer bg-light">
                    <button 
                        className={`btn btn-primary ${this.props.loading ? 'disabled btn-progress' : ''}`} 
                        onClick={async() => await this.enrollExam()}>
                        { this.props.contentExam.status == null ? 'Start Exam' 
                            : 
                            (this.props.contentExam.status == 'In Progress' 
                            ? 'Continue Exam' : 'You have finished this Exam') 
                        }
                    </button>
                </div>
            </div>
        )
    }
}

export default ExamPage;