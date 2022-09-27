import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import { createKPI, deleteKPI, getKPI, getKPIById, updateKPI } from "../../api/KeyPerformance";
import { getOrganization } from "../../api/Organization";
import { getPermission } from "../../api/Users";
import moment from "moment";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast";

class SettingKeyPerformance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kpiId :'',
            targetProgressCourse : '',
            targetAverageExam : '',
            yearPeriod : '',
            organizationCode : '',
            kpiData : [],
            permission : [],
            organization : [],
            onSubmit : false,
            titleModal : 'Create KPI',
            periodData : []
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.getData();
        const permission = await getPermission({
            role : Cookies.get('role'),
            type : 'Menu',
            url : this.props.location.pathname
        });
        if(permission.data == null){
            return this.props.history.push('/home/404');  
        }
        var period = [];
        let currentYear = moment(new Date()).format('Y');
        for(var i=currentYear; i <= parseFloat(currentYear)+parseFloat(10); i++){
            period.push(i);
        }
        this.setState({ 
            periodData : period,
            permission : permission.data.permission.split(', ')
        });
        $("#dataTable").DataTable({
            order : [['1', 'desc']],
            pageLength : 10
        });
    }

    async getData() {
        const kpi = await getKPI();
        this.setState({ kpiData : kpi.data });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.kpiId != this.state.kpiId && this.state.kpiId != ''){
            const kpi = await getKPIById(this.state.kpiId);
            this.setState({
                targetProgressCourse : kpi.data.target_progress_course,
                targetAverageExam : kpi.data.target_average_exam,
                yearPeriod : kpi.data.period_year,
                organizationCode : kpi.data.organization_code,
                titleModal : 'Update KPI'
            });
            await this.initModal();
        }
    }

    async initModal() {
        if(this.state.organization.length == 0){
            const organization = await getOrganization();
            this.setState({ organization : organization.data });
        }
        $("#modalKPI").modal('show');
    }

    async closeModal() {
        this.setState({
            kpiId :'',
            targetProgressCourse : '',
            targetAverageExam : '',
            yearPeriod : '',
            organizationCode : '',
            titleModal : 'Create KPI'
        });
        $("#modalKPI").modal('hide');
    }

    async saveData() {
        try {
            const data = {
                target_progress_course : this.state.targetProgressCourse,
                target_average_exam : this.state.targetAverageExam,
                period_year : this.state.yearPeriod,
                organization_code : this.state.organizationCode
            }
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.kpiId != ''){
                    save = await updateKPI(data, this.state.kpiId);
                }else {
                    save = await createKPI(data);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                    await this.getData();
                    await this.closeModal();
                }else {
                    iziToast.warning({
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        } catch(err) {
            console.log(err);
        }
    } 

    async deleteData(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this KPI",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteKPI(id);
                if(deleted.is_error == false){
                    await this.getData();
                    return iziToast.success({
                        title: "Success!",
                        message: handleMessage(deleted.message),
                        position: "topRight",
                    });
                }else {
                    return iziToast.error({
                        title: "Error!",
                        message: handleMessage(deleted.message),
                        position: "topRight",
                    });
                }
            }
        });
    }

    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Setting KPI</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Settings</div>
                            <div className="breadcrumb-item">Setting KPI</div>
                        </div>
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        {
                                            this.state.permission.includes('Create') ?
                                            <button onClick={async() => await this.initModal()} className="btn btn-primary mb-4"><i className="fa fa-plus"></i> 
                                                &nbsp;Create KPI
                                            </button>
                                            :
                                            ''
                                        }
                                        <div className="table table-responsive">
                                            <table className="table table-striped" id="dataTable">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Target All Course (%)</th>
                                                        <th>Target Average Exam (All)</th>
                                                        <th>Year Period</th>
                                                        <th>Organization</th>
                                                        <th>Created At</th>
                                                        <th>Updated At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.kpiData.map((kpi, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{kpi.id}</td>
                                                                    <td>{kpi.target_progress_course}</td>
                                                                    <td>{kpi.target_average_exam}</td>
                                                                    <td>{kpi.period_year}</td>
                                                                    <td>{kpi.organization.organization_name}</td>
                                                                    <td>{ moment(kpi.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(kpi.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>
                                                                        {
                                                                            this.state.permission.includes('Update') ?
                                                                            <button
                                                                                className="btn btn-primary w-100 my-2"
                                                                                onClick={(e) => this.setState({ kpiId : kpi.id }) }
                                                                            >
                                                                                Update
                                                                            </button>
                                                                            :
                                                                            ''
                                                                        }
                                                                        {
                                                                            this.state.permission.includes('Delete') ?
                                                                            <button
                                                                                className="btn btn-danger w-100 my-1 mb-2"
                                                                                onClick={async(e) => await this.deleteData(kpi.id) }
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                            :
                                                                            ''
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div id="modalKPI" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">{this.state.titleModal}</h5>
                                                    <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form>
                                                            <div className="form-group">
                                                                <label>Target All Progress Courses (%)</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Target Progress Courses..."
                                                                    value={ this.state.targetProgressCourse }
                                                                    onChange={(e) => this.setState({ targetProgressCourse : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Target Average All Exams</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Target Average Exams..."
                                                                    value={ this.state.targetAverageExam }
                                                                    onChange={(e) => this.setState({ targetAverageExam : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Year Period</label>
                                                                <select
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Target Average Exams..."
                                                                    value={ this.state.yearPeriod }
                                                                    onChange={(e) => this.setState({ yearPeriod : e.target.value }) }
                                                                >
                                                                    <option value="">Select Year</option>
                                                                    {
                                                                        this.state.periodData.map((year, key) => {
                                                                            return(
                                                                                <option key={key} value={year}>{year}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Organization</label>
                                                                <select
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Organization..."
                                                                    value={ this.state.organizationCode }
                                                                    onChange={(e) => this.setState({ organizationCode : e.target.value }) }
                                                                >
                                                                    <option value="">Select Organization</option>
                                                                    {
                                                                        this.state.organization.map((org, x) => {
                                                                            return(
                                                                                <option key={x} value={org.organization_code}>{org.organization_code} - {org.organization_name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={async() => await this.saveData()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
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

export default SettingKeyPerformance;