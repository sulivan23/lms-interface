import React, { Component } from "react"
import { completedSubLesson } from "../../api/Learning";
import { getLessonContentById } from "../../api/Lessons";
import iziToast from "izitoast";
import { handleMessage } from "../../api/Helper";

class LessonPage extends Component {
    constructor(props){
        super(props);
    }

    async componentDidMount() {
        await this.showContent();
    }

    async componentDidUpdate(prevProps){
        if(prevProps.lessonDetailId != this.props.lessonDetailId && this.props.lessonDetailId !=''){
            await this.showContent();
        }
    }

    async showContent() {
        const lessonContent = await getLessonContentById(this.props.lessonDetailId);
        this.props.changeContent(lessonContent.data.lesson_detail_title, lessonContent.data.lesson_content);
    }

    async completedLesson() {
        try {
            this.props.handleLoading(true);
            setTimeout(async() => {
                const completed = await completedSubLesson(this.props.courseEmployeeId, this.props.lessonDetailId);
                if(completed.is_error == false){
                    this.props.changeContent('','',completed.data.next_lesson);
                    window.scrollTo({
                        top : 0,
                        behavior : 'smooth'
                    });
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(completed.message),
                        position: "topRight",
                    });
                }else{
                    iziToast.warning({
                        title: "Warning!",
                        message: handleMessage(completed.message),
                        position: "topRight",
                    });
                }
                this.props.handleLoading(false);
            }, 1000);
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <div className="card-header bg-light text-dark">
                    <h4 className="text-dark">Title : { this.props.contentLesson.title }</h4>
                </div>
                <div className="card-body">
                    <div dangerouslySetInnerHTML={{ __html : this.props.contentLesson.content }}>
                    </div>
                </div>
                <div className="card-footer">
                    <button onClick={async() => await this.completedLesson()} className={`btn btn-primary ${this.props.loading ? 'disabled btn-progress' : ''}`}><i className="fas fa-check"></i> Completed Lesson</button>
                </div>
            </div>
        )
    }
}

export default LessonPage;