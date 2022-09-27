import Cookies from "js-cookie";
import React, { Component } from "react";
import { getPersonalInfo } from "../../api/Helper";
import { getPermission } from "../../api/Users";
import { Link } from "react-router-dom";
import moment from "moment";
import $ from "jquery";
import { getResultQuiz } from "../../api/Quiz";

class ResultQuiz extends Component { 

    constructor(props){
        super(props);
        this.state = {
            resultData : [],
        }
    }

    async componentDidMount() {
        await this.getResult();
        $("#dataTable").DataTable({
            order : [['1', 'desc']],
            pageLength : 10
        });
    }

    async getResult() {
        await getPersonalInfo();
        const permission = await getPermission({
            role : Cookies.get('role'),
            type : 'Menu',
            url : this.props.location.pathname
        });
        if(permission.data == null){
            return this.props.history.push('/home/404');  
        }
        let param;
        if(Cookies.get('role') == 'ADM') {
            param = {
                type : 'all'
            }
        }
        else if(Cookies.get('role') == 'CMO'){
            param = {
                type : 'employee',
                id : Cookies.get('userId')
            }
        }else {
            param = {
                type: 'organization',
                id : Cookies.get('userId')
            }
        }
        const result = await getResultQuiz(param);
        this.setState({ resultData : result.data });
    }

    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Result Quiz</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Result Quiz</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="table table-responsive">
                                            <table className="table table-striped" id="dataTable">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Title</th>
                                                        <th>Status</th>
                                                        <th>Start At</th>
                                                        <th>End At</th>
                                                        <th>Score</th>
                                                        <th>Course</th>
                                                        <th>Created At</th>
                                                        <th>Updated At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.resultData.map((result, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{result.id}</td>
                                                                    <td>{result.quiz.title}</td>
                                                                    <td>{result.status}</td>
                                                                    <td>{ moment(result.start_at).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(result.end_at).format('Y-MM-DD HH:mm:ss')  }</td>
                                                                    <td>{result.score}</td>
                                                                    <td>{result.courses_employee.course.course_name}</td>
                                                                    <td>{ moment(result.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(result.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>
                                                                        {
                                                                            result.status == 'Done' ?
                                                                                <Link class="btn btn-primary my-2 mb-2 w-100" to={`/home/quiz_answer/${result.quiz.id}/1/result`}>Detail</Link>
                                                                            :
                                                                            ''
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
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

export default ResultQuiz;