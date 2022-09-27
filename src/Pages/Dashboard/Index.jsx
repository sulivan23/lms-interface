import Cookies from "js-cookie";
import React, { Component } from "react";
import AvailableCourses from "./AvailableCourses";
import AvailableQuizContest from "./AvailableQuizContest";
import DataInfo from "./DataInfo";
import KeyPerformance from "./KeyPerformance";

export class Dashboard extends Component {

  render() {
    return (
      <div className="main-content">
        <section className="section">
          <div className="section-header">
            <h1>Dashboard</h1>
          </div>
          { Cookies.get('role') == 'A' ?
            <DataInfo/>
            : 
            <div>
              <KeyPerformance/>
              <AvailableCourses/>
              <AvailableQuizContest/>
            </div>
          }
        </section>
      </div>
    );
  }
}

export default Dashboard;
