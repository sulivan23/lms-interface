import Cookies from "js-cookie";
import React, { Component } from "react";
import { getPersonalInfo } from "../../../api/Helper";
import { getPermission } from "../../../api/Users";
import { Link } from "react-router-dom";
import moment from "moment";
import $ from "jquery";
import { getWinnerQuizContest } from "../../../api/QuizContest";

class WinnerQuizContest extends Component { 

    constructor(props){
        super(props);
        this.state = {
            winnerData : [],
        }
    }

    async componentDidMount() {
        await this.getWinner();
        $("#dataTable").DataTable({
            order : [['1', 'desc']],
            pageLength : 10
        });
    }

    async getWinner() {
        await getPersonalInfo();
        const permission = await getPermission({
            role : Cookies.get('role'),
            type : 'Menu',
            url : this.props.location.pathname
        });
        if(permission.data == null){
            return this.props.history.push('/home/404');  
        }
        const winner = await getWinnerQuizContest();
        this.setState({ winnerData : winner.data });
    }

    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Winner Quiz Contest</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Winner Quiz Contest</div>
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
                                                        <th>Type</th>
                                                        <th>Quiz</th>
                                                        <th>Quiz Date</th>
                                                        <th>Winner</th>
                                                        <th>Prize</th>
                                                        <th>Email</th>
                                                        <th>Organization</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.winnerData.map((winner, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{winner.id}</td>
                                                                    <td>{winner.winner_type}</td>
                                                                    <td>{winner.title_quiz}</td>
                                                                    <td>{ moment(winner.quiz_date).format('D MMMM Y HH:mm:ss') }</td>
                                                                    <td>{winner.user.name}</td>
                                                                    <td>{winner.prize_description}</td>
                                                                    <td>{winner.user.email}</td>
                                                                    <td>{winner.user.organization.organization_name}</td>
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

export default WinnerQuizContest;