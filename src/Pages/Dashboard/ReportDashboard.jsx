import React, { Component } from "react";
import moment from "moment";
import { reportDashboardEmployee } from "../../api/KeyPerformance";
import Cookies from "js-cookie";
import { getKeyValue } from "../../api/Helper";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js';

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

class ReportDashboard extends Component {

    constructor(props){
        super(props);
        this.state = {
            labels : [],
            labelsPie : [],
            avgExam : [],
            avgCourse : [],
            groupCourse : [],
            countCourse : 0,
            countOrg : 0,
            countUsers : 0,
            valuePie : []
        };
    }

    async componentDidMount() {
        /* For Bar Chart */
        var labelEmp = [];
        var avgCourse = [];
        var avgExam = []
        var labelPie = [];
        var valuePie = [];
        const report = await reportDashboardEmployee(Cookies.get('userId'));
        const valueExam = getKeyValue(report.data.average_exam);
        const valueCourse = getKeyValue(report.data.average_course);
        for(var x = 0 ; x < report.data.average_exam.length; x++){
            labelEmp.push(report.data.average_exam[x].name);
        }
        for(var i = 0; i < valueExam.length; i++){
            avgCourse.push(valueCourse[i][1]);
            avgExam.push(valueExam[i][1]);    
        }
        /* Pie Chart */
        const valueOrg = report.data.group_course;
        for(var i = 0; i < valueOrg.length; i++){
            labelPie.push(valueOrg[i].organization_name);
            valuePie.push(valueOrg[i].count_course)
        }
        this.setState({
            avgExam : avgExam,
            avgCourse : avgCourse,
            groupCourse : report.data.group_course,
            countCourse : report.data.count_course,
            countOrg : report.data.count_org,
            countUsers : report.data.count_users,
            labels : labelEmp,
            labelsPie : labelPie,
            valuePie : valuePie
        });
    }

    render() {
        console.log(this.state.labels);
        const options = {
            indexAxis: 'x',
            elements: {
              bar: {
                borderWidth: 2,
              },
            },
            scales: {   
               y : {
                    beginAtZero: true,
                    max: 100
               }
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Key Performance Indicator Per Employee',
              },
            },
          };
          
        const labels = this.state.labels;
          
        const data = {
            labels,
            datasets: [
              {
                label: 'KPI Average Course (%)',
                data: this.state.avgCourse,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'KPI Average Exam (Point)',
                data: this.state.avgExam,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
        };

        const dataPie = {
            labels: this.state.labelsPie,
            datasets: [
              {
                label: '# of Votes',
                data: this.state.valuePie,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
        };

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
                            <div className="card-body">{this.state.countCourse}</div>
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
                                <h4>Employees</h4>
                            </div>
                            <div className="card-body">{this.state.countUsers}</div>
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
                                <h4>Organization</h4>
                            </div>
                            <div className="card-body">{this.state.countOrg}</div>
                        </div>
                    </div>
                </div>
                <div class="col-8">
                    <div className="card shadow-md">
                        <div class="card-header bg-primary text-white w-100">
                            <h5>KPI Report</h5>
                        </div>
                        <div className="card-body">
                            <Bar 
                                options={options} 
                                data={data} 
                            />
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div className="card shadow-md">
                        <div class="card-header bg-primary text-white w-100">
                            <h5>Number Of Course Per Organization</h5>
                        </div>
                        <div className="card-body">
                            <Pie 
                                data={dataPie} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportDashboard;