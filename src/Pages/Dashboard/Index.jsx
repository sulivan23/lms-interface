import Cookies from "js-cookie";
import React, { Component } from "react";
import AvailableCourses from "./AvailableCourses";
import AvailableQuizContest from "./AvailableQuizContest";
import KeyPerformance from "./KeyPerformance";
import ReportDashboard from "./ReportDashboard";

export class Dashboard extends Component {

  render() {
    return (
      <div className="main-content">
        <section className="section">
          <div className="section-header">
            <h1>Dashboard</h1>
          </div>
          {
            Cookies.get('role') == 'CMO' 
            ?
            <KeyPerformance/>
            :
            <ReportDashboard />
          }
          <AvailableCourses/>
          <AvailableQuizContest/>
        </section>
      </div>
    );
  }
}

export default Dashboard;
