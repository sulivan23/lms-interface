import React, { Component } from "react";
import { deleteImgContent, getLessonByCourse, getLessonById, getLessonContentById, getLessonContentByLesson, uploadImgContent } from "../../api/Lessons";
import $ from "jquery";
import { createLessonContent, updateLessonContent } from "../../api/Lessons";
import iziToast from "izitoast";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import { Link } from "react-router-dom";

class LessonsForm extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            lessonId : this.props.match.params.type == "create" ? this.props.match.params.id : '',
            lessonDetailId : this.props.match.params.type == "update" ? this.props.match.params.id : '',
            type : this.props.match.params.type,
            lesson : '',
            onSubmit : false,
            lessonTitle : '',
            lessonDetailTitle : '',
            lessonContent : '',
            onSubmit : false,
            lessonData : []
        }
    }

    
    async componentDidMount() {
      await getPersonalInfo();
        $(".summernote").summernote({
          dialogsInBody: true,
          minHeight: 250,
          callbacks : {
              onChange : (content) => {
                  this.setState({  lessonContent : content });
              },
              onImageUpload : async(images) => {
                  const upload = await uploadImgContent(images[0]);
                  if(upload.is_error == false){
                    $('.summernote').summernote("insertImage", upload.data.url);
                  }
              },
              onMediaDelete : async(target) => {
                  console.log(target);
                  const deleted = await deleteImgContent(target[0].src);
                  console.log(deleted);
              }
          }
      });
      await this.getData();
    }

    async saveContent() {
        try {
          const data = {
            lesson_id : this.state.lessonId, 
            lesson_detail_title : this.state.lessonDetailTitle,
            lesson_content : this.state.lessonContent
          };
          this.setState({ onSubmit : true });
          setTimeout(async() => {
            var save;
            if(this.state.type == "create"){
              save = await createLessonContent(data);
            }else{
              save = await updateLessonContent(data, this.state.lessonDetailId);
            }
            if(save.is_error == false){
              iziToast.success({
                  title: "Success!",
                  message: handleMessage(save.message),
                  position: "topRight",
              });
              this.props.history.push("/home/lessons");
            }else{
              iziToast.warning({
                  message: handleMessage(save.message),
                  position: "topRight",
              });
            }
            this.setState({ onSubmit : false });
          }, 1000);
        } catch(err) {
          console.log(err);
        }
    }

    async getData() {
        if(this.state.type == 'create') {
            const lesson = await getLessonById(this.state.lessonId);
            this.setState({ lessonTitle : lesson.data.lesson_title });
        }else{
            const lessonContent = await getLessonContentById(this.state.lessonDetailId);
            this.setState({ 
              lessonId : lessonContent.data.lesson_id,
              lessonContent : lessonContent.data.lesson_content,
              lessonDetailTitle : lessonContent.data.lesson_detail_title
            });
            const lesson = await getLessonByCourse(lessonContent.data.lesson.course_id);
            this.setState({ lessonData : lesson.data });
            $(".summernote").summernote('code', this.state.lessonContent);
        }
    }

    async componentDidUpdate(){

    }

    render() {
        return(
            <div className="main-content">
            <section className="section">
              <div className="section-header">
                <h1>{ this.state.type == 'create' ? 'Create Sub Lesson' : 'Update Sub Lesson'}</h1>
                <div className="section-header-breadcrumb">
                  <div className="breadcrumb-item active">
                    <a href="">Dashboard</a>
                  </div>
                  <div className="breadcrumb-item">
                    <a href="">Lessons</a>
                  </div>
                  <div className="breadcrumb-item">Create</div>
                </div>
              </div>
    
              <div className="section-body">
                  
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-primary">
                        <h4 className="text-white">{ this.state.type == 'create' ? `Lesson : ${this.state.lessonTitle}` : 'Update Sub Lesson' }</h4>
                      </div>
                      <div className="card-body">
                        { this.state.type == "update" 
                          ? 
                            <div className="form-group row mb-4">
                              <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                                Lesson
                              </label>
                              <div className="col-sm-12 col-md-7">
                                <select 
                                  className="form-control"
                                  value={this.state.lessonId}
                                  onChange={(e) => this.setState({ lessonId : e.target.value })}>
                                  <option value="">Select Lesson</option>
                                  { this.state.lessonData.map((les, key) => {
                                      return (
                                        <option key={key} value={les.id}>{les.lesson_title}</option>
                                      )
                                    }) 
                                  }
                                  </select>
                              </div>
                            </div> 
                          :
                          ''
                        }
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Title
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input 
                              type="text" 
                              className="form-control"
                              value={this.state.lessonDetailTitle}
                              onChange={(e) => this.setState({ lessonDetailTitle : e.target.value })} />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Content
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <textarea className="summernote">
                            </textarea>
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3"></label>
                          <div className="col-sm-12 col-md-7">
                            <button onClick={async() => this.saveContent() } className="btn btn-primary">{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
                            <Link to="/home/lessons" className="btn btn-warning ml-2"><i className="fa fa-arrow-left"></i> Back</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )
    }
}

export default LessonsForm;