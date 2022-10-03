import React, { Component } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from "react-chartjs-2";
import moment from "moment";
import { reportDashboardEmployee } from "../../api/KeyPerformance";
import Cookies from "js-cookie";
import { getKeyValue } from "../../api/Helper";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

class KeyPerformance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            labels : [],
            averageCourse : 0,
            averageExam : 0,
            targetAvgCourse : 0,
            targetAvgExam : 0,
            totalCourses : 0,
            avgCoursePerMonth : [],
            avgExamPerMonth : []
        }

    }

    async componentDidMount() {
        var arrObj = {};
        var month = [];
        var courseAvg = [];
        var examAvg = [];
        const reportDashboard = await reportDashboardEmployee(Cookies.get('userId'));
        const value = getKeyValue(reportDashboard.data.course_report);
        const valueExam = getKeyValue(reportDashboard.data.exam_report);
        for(var i = 0; i < value.length; i++){
            month.push(value[i][0]);
            courseAvg.push(value[i][1]);
            examAvg.push(valueExam[i][1]);    
        }
        this.setState({
            averageCourse : reportDashboard.data.average_course,
            targetAvgCourse : reportDashboard.data.target_average_course,
            totalCourses : reportDashboard.data.count_course,
            averageExam : reportDashboard.data.average_exam,
            targetAvgExam : reportDashboard.data.target_average_exam,
            labels : month,
            avgCoursePerMonth : courseAvg,
            avgExamPerMonth : examAvg
        });
    }

    render(){
        console.log(this.state.avgExamPerMonth);
        const { labels } = this.state; 

        const options = {
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function(value, index, values) {
                            return value;
                        }      
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Key Performance Indicator',
                },
            },
        }

        const data = {
            labels,
            datasets: [
                {
                    label: 'KPI Average Course (%)',
                    data: this.state.avgCoursePerMonth,
                    borderColor: '#76D0FD',
                    backgroundColor: '#064F73',
                },
                {
                    label: 'KPI Average Exam (Point)',
                    data: this.state.avgExamPerMonth,
                    borderColor: '#FF6C6C',
                    backgroundColor: '#E61D1D',
                }
            ],
        }

        return (
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-primary">
                            <i className="far fa-user"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Courses Total</h4>
                            </div>
                            <div className="card-body">{this.state.totalCourses}</div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-danger">
                            <i className="far fa-newspaper"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>Period</h4>
                            </div>
                            <div className="card-body">{moment(new Date()).format('Y')}</div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-warning">
                            <i className="far fa-file"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>KPI Course / Target</h4>
                            </div>
                            <div className="card-body">{this.state.averageCourse}% / {this.state.targetAvgCourse}%</div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card card-statistic-1">
                        <div className="card-icon bg-success">
                            <i className="fas fa-circle"></i>
                        </div>
                        <div className="card-wrap">
                            <div className="card-header">
                                <h4>KPI Exam / Target (Point)</h4>
                            </div>
                            <div className="card-body">{this.state.averageExam} / {this.state.targetAvgExam}</div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div className="card shadow-md">
                        <div class="card-header bg-primary text-white w-100">
                            <h5>KPI Report</h5>
                        </div>
                        <div className="card-body">
                            <Line 
                                options={options} 
                                data={data} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default KeyPerformance;