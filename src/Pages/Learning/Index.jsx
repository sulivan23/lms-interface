import React, { Component } from "react";
import { Link } from "react-router-dom";
import Content from "./Content";
import ListOfContent from "./listOfContent";

class Learning extends Component {

    constructor(props){
        super(props);
        this.state = {
            courseEmployeeId : '',
            courseId : '',
            refreshContent : false
        }
    }

    setCourseEmployeeId(id) {
        if(this.state.courseEmployeeId == ''){
            this.setState({ courseEmployeeId : id });
        }
    }

    onHistoryPush(url) {
        this.props.history.push(url);
    }

    render() {

        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Course Learning</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Courses</div>
                            <div className="breadcrumb-item">Course Learning</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-md-4">
                                <ListOfContent
                                    type={this.props.match.params.type}
                                    id={this.props.match.params.id}
                                    courseId={this.props.match.params.courseId}
                                    setCourseEmp={(id) => this.setCourseEmployeeId(id)}
                                    refreshContent={this.state.refreshContent}
                                    onRefreshContent={(boolean) => this.setState({ refreshContent : boolean  })}
                                />
                            </div>
                            <div className="col-md-8">
                                <Content
                                    type={this.props.match.params.type}
                                    id={this.props.match.params.id}
                                    courseId={this.props.match.params.courseId}
                                    courseEmployeeId={this.state.courseEmployeeId}
                                    history={(url) => this.onHistoryPush(url)}
                                    onRefreshContent={(boolean) => this.setState({ refreshContent : boolean  })}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Learning;