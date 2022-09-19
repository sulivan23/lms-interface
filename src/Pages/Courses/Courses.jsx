import React from "react";
import CoursesData from "./Data";
import { Link } from "react-router-dom";

const Courses = () => {  

    return (
        <div className="main-content">
          <section className="section">
            <div className="section-header">
              <h1>Manage Courses</h1>
              <div className="section-header-breadcrumb">
                <div className="breadcrumb-item active">
                  <Link to="/home">Dashboard</Link>
                </div>
                <div className="breadcrumb-item">Manage Courses</div>
              </div>
            </div>
  
            <div className="section-body">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                        <CoursesData />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
    );
}

export default Courses;