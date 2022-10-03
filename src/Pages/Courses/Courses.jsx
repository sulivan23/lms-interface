import React, {Component} from "react";
import CoursesData from "./Data";
import { Link } from "react-router-dom";

class Courses extends Component {  

    constructor(props){
      super(props);
    }
    render() {
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
                          <CoursesData 
                            path={this.props.location.pathname}
                            history={(url) => this.props.history.push(url)}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
      );
    }
}

export default Courses;