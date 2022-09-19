import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { createOrganization, deleteOrganization, getOrganization, getOrganizationByCode, updateOrganization } from "../../api/Organization";
import swal from "sweetalert";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import iziToast from "izitoast";
import moment from "moment";
import Cookies from "js-cookie";
import { getPermission } from "../../api/Users";

class Organization extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organization : [],
            organization_code : '',
            organization_name : '',
            organization_code_head : '',
            organization_type : '',
            organization_code_edit : '',
            titleModal : 'Create Organization',
            type : ['Department', 'Division', 'Board Of Director', 'President Director'],
            onSubmit : false,
            permission : [],
            accessToken : '',
            userInfo : {}
        }
    }

    async componentDidMount(){
        await getPersonalInfo();
        await this.getOrganization();
        const permission = await getPermission({
            role : Cookies.get('role'),
            type : 'Menu',
            url : this.props.location.pathname
        });
        if(permission.data == null){
            return this.props.history.push('/home/404');  
        }
        this.setState({ permission : permission.data.permission.split(', ') });
        $("#dataTable").DataTable({
            pageLength : 10
        });
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevState.organization_code_edit != this.state.organization_code_edit 
            && this.state.organization_code_edit != ''){
            const org = await getOrganizationByCode(this.state.organization_code_edit);
            this.setState({
                organization_code : org.data.organization_code,
                organization_name : org.data.organization_name,
                organization_code_head : org.data.organization_code_head,
                organization_type : org.data.organization_type,
                titleModal : 'Update Organization'
            });
            await this.initModal();
        }
    }

    async getOrganization() {
        const organization = await getOrganization();
        this.setState({ organization : organization.data });
    }

    async saveOrganization() {
        try {
            const data = {
                organization_code : this.state.organization_code,
                organization_name : this.state.organization_name,
                organization_code_head : this.state.organization_code_head,
                organization_type : this.state.organization_type
            }
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.organization_code_edit == ''){
                    save = await createOrganization(data)
                }else{
                    save = await updateOrganization(data, this.state.organization_code_edit);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                    await this.closeModal();
                    await this.getOrganization();
                }else{
                    iziToast.warning({
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        } catch(err) {
            console.log(err);
        }
    }

    async deleteOrganization(orgCode){
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this organization",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteOrganization(orgCode);
                if(deleted.is_error == false){
                    await this.getOrganization();
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

    async initModal() {
        $("#modalOrg").modal('show');
    }

    async closeModal() {
        this.setState({
            organization_code : '',
            organization_code_head: '',
            organization_name : '',
            organization_type : '',
            organization_code_edit : '',
            titleModal : 'Create Organization'
        });
        $("#modalOrg").modal('hide');
    }
    
    render() {
        const { organization, type } = this.state;
        return(
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                    <h1>Organization</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Users</div>
                            <div className="breadcrumb-item">Organization</div>
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
                                                    &nbsp;Create Organization
                                                </button> 
                                            : 
                                            ''
                                        }
                                        <div className="table table-responsive">
                                        <table className="table table-striped" id="dataTable">
                                            <thead>
                                                <tr>
                                                    <th>Organization Code</th>
                                                    <th>Organization Name</th>
                                                    <th>Organization Head</th>
                                                    <th>Type</th>
                                                    <th>Created At</th>
                                                    <th>Updated At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    organization.map((org, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{org.organization_code}</td>
                                                                <td>{org.organization_name}</td>
                                                                <td>{org.organization_code_head}</td>
                                                                <td>{org.organization_type}</td>
                                                                <td>{ moment(org.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                <td>{ moment(org.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                <td>
                                                                    {
                                                                        this.state.permission.includes('Update') ? 
                                                                        <button
                                                                            className="btn btn-primary w-100 my-2"
                                                                            onClick={(e) => this.setState({ organization_code_edit : org.organization_code }) }
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
                                                                            onClick={async(e) => await this.deleteOrganization(org.organization_code) }
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
                                        <div id="modalOrg" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                <label>Organization Code</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Organization Code..."
                                                                    value={ this.state.organization_code }
                                                                    onChange={(e) => this.setState({ organization_code : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Organization Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Organization Name..."
                                                                    value={ this.state.organization_name }
                                                                    onChange={(e) => this.setState({ organization_name : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Organization Code Head</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Organization Head..."
                                                                    value={ this.state.organization_code_head }
                                                                    onChange={(e) => this.setState({ organization_code_head : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Organization Type</label>
                                                                <select 
                                                                    className="form-control selectric"
                                                                    onChange={(e) => this.setState({ organization_type : e.target.value }) }
                                                                >
                                                                    { type.map((tipe, key) => {
                                                                        return (
                                                                            <option key={key}>{tipe}</option>
                                                                        )
                                                                    }) }
                                                                </select>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={async() => await this.saveOrganization()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
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

export default Organization;