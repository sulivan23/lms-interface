import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Error404 extends Component {
  render() {
    return (
        <div className="main-content">
        <section className="section">
          <div className="section-header">
          <h1>Error 404</h1>
              <div className="section-header-breadcrumb">
                  <div className="breadcrumb-item active">
                      <Link to="/home">Dashboard</Link>
                  </div>
                  <div className="breadcrumb-item">Error 404</div>
              </div>
          </div>
          <div class="container mt-5">
            <div class="page-error">
              <div class="page-inner">
                <h1>404</h1>
                <div class="page-description">
                  The page you were looking for could not be found.
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
    );
  }
}

export default Error404;
