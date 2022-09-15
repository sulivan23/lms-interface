import React, { Component } from "react";
import $ from "jquery";
import moment from "moment";
import { Link } from "react-router-dom";
import { deleteLessonContent } from "../../api/Lessons";
import swal from "sweetalert";
import { handleMessage } from "../../api/Helper";
import iziToast from "izitoast";

class SubLessons extends Component {

    constructor(props){
        super(props);
    }

    dataNotFound() {
        return (
            <tr>
                <td valign="top" class="dataTables_empty text-center" colspan="5">No data available in table</td>
            </tr>
        )
    }

    async componentDidMount() {
        $("#dataTable2").DataTable({

        });
    }

    async componentDidUpdate(){
        const length = this.props.lessonsContent.length;
        if(length > 0){
            $("td.dataTables_empty").remove();
        }
    }

    async deleteLessonContent(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this lesson",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteLessonContent(id);
                if(deleted.is_error == false){
                    this.props.onContentChange(this.props.lessonId);
                    return iziToast.success({
                        title: "Success!",
                        message: handleMessage(deleted.message),
                        position: "topRight",
                    });
                }else {
                    return iziToast.error({
                        title: "Error!",
                        message: handleMessage(deleted.message),
                        position: "topRight",
                    });
                }
            }
        });
    }

    render() {

        const { lessonsContent } = this.props;

        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h5 class="my-2 mb-4">Lesson Content</h5>
                        { this.props.lessonId != '' 
                            ?
                            <Link 
                                to={`/home/lessons/${this.props.lessonId}/create`}
                                className="btn btn-primary mb-4">
                                <i className="fa fa-plus"></i>&nbsp;Create Content
                            </Link>  
                            :
                            ''
                        }
                        { this.props.loadingContent == true ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div>  : '' }
                        <div className="table table-responsive">
                            <table className="table table-striped" id="dataTable2">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Lesson Content Title</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { lessonsContent.map((lesCon, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{lesCon.id}</td>
                                                <td>{lesCon.lesson_detail_title}</td>
                                                <td>{moment(lesCon.createdAt).format('Y-MM-DD HH:mm:ss')}</td>
                                                <td>{moment(lesCon.updatedAt).format('Y-MM-DD HH:mm:ss')}</td>
                                                <td>
                                                    <Link
                                                        to={`/home/lessons/${lesCon.id}/update`}
                                                        className="btn btn-primary w-100 my-2"
                                                    >
                                                        Update
                                                    </Link>
                                                    <button
                                                        className="btn btn-danger w-100 my-1 mb-2"
                                                        onClick={async(e) => await this.deleteLessonContent(lesCon.id) }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }) }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SubLessons;