import Cookies from "js-cookie";
import React, { Component } from "react";
import $ from "jquery";
import { getPersonalInfo } from "../../api/Helper";
import iziToast from "izitoast";
import swal from "sweetalert";
import { handleMessage } from "../../api/Helper";
import moment from "moment";
import { withRouter } from "react-router";
import { getPrizeByQuizContest, getQuizContest } from "../../api/QuizContest";
import { enrollQuizContest } from "../../api/Learning";

class AvailableQuizContest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizContest : [],
            prizeDetail : []
        }
    }

    async componentDidMount() {
        const { user } = await getPersonalInfo();
        await this.getQuizContest();
    }

    async getQuizContest() {
        const quizContest = await getQuizContest();
        this.setState({ quizContest : quizContest.data });
    }

    async takeQuizContest(quizContestId) {
        swal({
            title: "Take course",
            text: "Are you sure wanna take this quiz ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        }).then(async(willTake) => {
            if(willTake){
                const enroll = await enrollQuizContest(quizContestId, Cookies.get('userId'));
                if(enroll.is_error == false){
                    this.props.history.push(`/home/quiz_contest_answer/${quizContestId}/1`);
                    return iziToast.success({
                        title: "Success!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }else {
                    return iziToast.error({
                        title: "Error!",
                        message: handleMessage(enroll.message),
                        position: "topRight",
                    });
                }
            }
        });
    }

    async detailPrize(id, e) {
        e.preventDefault();
        const getPrize = await getPrizeByQuizContest(id);
        this.setState({ prizeDetail : getPrize.data });
        await this.initModal();
    }

    async initModal() {
        $("#modalPrize").modal('show');
    }

    async closeModal() {
        this.setState({ prizeDetail : [] });
        $("#modalPrize").modal('hide');
    }

    render() {
        return (
            <div>
                <h2 className="section-title">Available Quiz Contest</h2>
                {
                    this.state.quizContest.length == 0 ? <div> <p className="text-center">No available quiz contest found</p> </div> : ''
                }
                <div className="row">
                    <div className="col-12 col-md-4 col-lg-4">
                        { this.state.quizContest.map((quizContest, i) => {
                            return (
                                <article key={i} className="article article-style-c">
                                    <div className="article-details" style={{ height : '300px' }}>
                                        <div className="article-category">
                                            <a>Due Date : { moment(new Date(quizContest.due_date)).format('DD MMMM Y')}</a>
                                        </div>
                                        <div className="article-title">
                                            <h2>
                                                <a href="#" onClick={async(e) => await this.detailPrize(quizContest.id, e)}>
                                                    {quizContest.title}
                                                </a>
                                            </h2>
                                        </div>
                                        <p>
                                            {quizContest.description}
                                        </p>
                                        <div className="article-user">
                                            <img
                                                alt="image"
                                                src="../../assets/img/avatar/avatar-1.png"
                                            />
                                            <div className="article-user-details">
                                                <div className="user-detail-name">
                                                    <a href="#">{ quizContest.user.name }</a>
                                                </div>
                                                <div className="text-job">All Organization</div>
                                            </div>
                                        </div>
                                        <button onClick={async(e) => this.takeQuizContest(quizContest.id)} className="btn btn-primary my-3 w-100">Take Quiz</button>
                                    </div>
                                </article>
                            )
                        }) }
                    </div>
                    <div id="modalPrize" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Detail Prize</h5>
                                    <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-striped table-bordered">
                                        <th>Prize Type</th>
                                        <th>Description</th>
                                        <th>Winner</th>
                                        <tbody>
                                            {
                                                this.state.prizeDetail.map((prize, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{prize.winner_type}</td>
                                                            <td>{prize.prize_description}</td>
                                                            <td>{prize.quiz_contest_winner == null ? 'Belum ada pemenang' : prize.quiz_contest_winner.user.name}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AvailableQuizContest);