import React, { Component } from "react";
import { Link } from "react-router-dom";
import { reportKPI } from "../../api/KeyPerformance";
import { getOrganization } from "../../api/Organization";
import { getUsers, getUsersByOrg } from "../../api/Users";
import moment from "moment";

class ReportKeyPerformance extends Component {

    constructor(props){
        super(props);
        this.state = {
            data : [],
            organization : [],
            employee : [],
            filterOrg : '',
            filterEmp : '',
            onSubmitFilter : false
        }
    }

    async componentDidMount() {
        const org = await getOrganization();
        const user = await getUsers();
        this.setState({
            organization : org.data,
            employee : user.data
        });
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevState.filterOrg != this.state.filterOrg && this.state.filterOrg != ''){
            const emp = await getUsersByOrg(this.state.filterOrg);
            this.setState({ employee : emp.data });
        }
        if(prevState.filterOrg != this.state.filterOrg && this.state.filterOrg == ''){
            const emp = await getUsers();
            this.setState({ employee : emp.data });
        }
    }

    async filterData() {
        this.setState({ onSubmitFilter : true });
        const getReport = await reportKPI(this.state.filterOrg, this.state.filterEmp);
        this.setState({ data : getReport.data });
        this.setState({ onSubmitFilter : false });
    }

    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Key Performance Indicator Reporting</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">KPI Reporting</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-12 mb-4">
                                <div class="row">
                                    <div class="col-4">
                                        <label>Filter Organization</label>
                                        <select 
                                        value={this.state.filterOrg}
                                        onChange={(e) => this.setState({ filterOrg : e.target.value })}
                                        className="form-control">
                                            <option value="">Select Organization</option>
                                            {
                                                this.state.organization.map((org, key) => {
                                                    return (
                                                        <option key={key} value={org.organization_code}>{org.organization_name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div class="col-4">
                                        <label>Filter Employee</label>
                                        <select 
                                        value={this.state.filterEmp}
                                        onChange={(e) => this.setState({ filterEmp : e.target.value })}
                                        className="form-control">
                                            <option value="">Select Employee</option>
                                            {
                                                this.state.employee.map((emp, key) => {
                                                    return (
                                                        <option key={key} value={emp.id}>{emp.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div class="col-4">
                                        <label>Submit</label>
                                        <button 
                                            className={`btn btn-primary w-100 ${this.state.onSubmitFilter ? ' btn-progress disabled' : ''}`}
                                            onClick={async() => await this.filterData()}
                                        >
                                            Submit Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="table table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Name</th>
                                                        <th>Score</th>
                                                        <th>Target</th>
                                                        <th>KPI Status</th>
                                                        <th>Type</th>
                                                        <th>Organization</th>
                                                        <th>Periode</th>
                                                        <th>Tahun</th>
                                                        <th>Tgl Generate</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.data.length == 0 ?
                                                        <td colSpan={10} className="text-center">No data available</td>
                                                        :
                                                        ''
                                                    }
                                                    {
                                                        this.state.data.map((kpi, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <td>{key+1}</td>
                                                                    <td>{kpi.name}</td>
                                                                    <td>{kpi.score}</td>
                                                                    <td>{kpi.target}</td>
                                                                    <td>{kpi.status}</td>
                                                                    <td>{kpi.type}</td>
                                                                    <td>{kpi.organization}</td>
                                                                    <td>{kpi.periode}</td>
                                                                    <td>{kpi.tahun}</td>
                                                                    <td>{moment(kpi.tgl_generate).format('D MMMM Y')}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default ReportKeyPerformance;