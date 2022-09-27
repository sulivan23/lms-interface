import React, { Component } from "react";
import { Link } from "react-router-dom";

class ReportKeyPerformance extends Component {
    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>My Quiz</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">My Quiz</div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default ReportKeyPerformance;