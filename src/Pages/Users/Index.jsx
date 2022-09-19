import React, { Component } from "react";
import { getPosition, getRoles, getUsers, getUser, createUser, deleteUser, updateUser, getUserById, getUsersByOrg, getPermission } from "../../api/Users";
import moment from "moment";
import { Link } from "react-router-dom";
import iziToast from "izitoast";
import $, { timers } from "jquery";
import { getOrganization } from "../../api/Organization";
import swal from "sweetalert";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import Cookies from "js-cookie";

class Users extends Component {

    constructor(props){
        super(props);
        this.state = {
            name : '',
            email : '',
            phone_number : '',
            password : '',
            organization_code : '',
            roles : '',
            status : '',
            position_code : '',
            organization : [],
            rolesData : [],
            position : [],
            users : [],
            statusType : ['Actived', 'Deactived'],
            userId : '',
            onSubmit : false,
            titleModal : 'Create User',
            permission : [],
            userInfo : {}
        }
    }

    async componentDidMount(){
        await getPersonalInfo();
        await this.getUsers();
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
            order : [['0', 'desc']],
            pageLength : 10
        });
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevState.userId != this.state.userId && this.state.userId != ''){
            const data = await getUser(this.state.userId);
            const user = data.userData.data;
            await this.initModal();
            this.setState({
                name : user.name,
                email : user.email,
                phone_number : user.phone_number,
                password : '',
                organization_code : user.organization.organization_code,
                roles : user.role.roles,
                status : user.status,
                position_code : user.position.position_code,
                titleModal : 'Update User'
            });
        }
    }

    async saveUser() {
        try {
            const data = {
                name : this.state.name,
                email : this.state.email,
                phone_number : this.state.phone_number,
                organization : this.state.organization_code,
                position : this.state.position_code,
                roles : this.state.roles,
                status : this.state.status,
            }
            if(this.state.password != ''){
                Object.assign(data, { password : this.state.password });
            }
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.userId == ''){
                    save = await createUser(data);
                }else{
                    save = await updateUser(data, this.state.userId);
                }
                console.log(save);
                if(save.is_error == false){
                    iziToast.success({
                        title: "Success!",
                        message: handleMessage(save.message),
                        position: "topRight",
                    });
                    await this.closeModal();
                    await this.getUsers();
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

    async getUsers() {
        var users;
        if(Cookies.get('role') == "SPV"){
            const myUser = await getUserById(Cookies.get('userId'));
            const myOrg = myUser.data;
            users = await getUsersByOrg(myOrg.organization.organization_code);
        }else{
            users = await getUsers();
        }
        const usersData = users.data;
        this.setState({ users : usersData });
    }

    async initModal() {
        const org = await getOrganization();
        const position = await getPosition();
        const roles = await getRoles();
        this.setState({
            organization : org.data,
            position : position.data,
            rolesData : roles.data
        });
        $('#modalUser').modal('show');
    }

    async closeModal() {
        this.setState({
            name : '',
            email : '',
            phone_number : '',
            password : '',
            organization_code : '',
            position_code : '',
            roles : '',
            status : '',
            userId : '',
            titleModal : 'Create User'
        });
        $('#modalUser').modal('hide');
    }

    async deleteUser(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this user",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deleteUser(id);
                if(deleted.is_error == false){
                    await this.getUsers();
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
        const { users, rolesData, position, organization, statusType } = this.state;
        return(
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                    <h1>Users</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Users</div>
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
                                                &nbsp;Create User
                                            </button>
                                            :
                                            ''
                                        }
                                        <div className="table table-responsive">
                                        <table className="table table-striped" id="dataTable">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Organization</th>
                                                    <th>Roles</th>
                                                    <th>Status</th>
                                                    <th>Position</th>
                                                    <th>Created At</th>
                                                    <th>Updated At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    users.map((user, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{user.id}</td>
                                                                <td>{user.name}</td>
                                                                <td>{user.organization.organization_name}</td>
                                                                <td>{user.role.roles_description}</td>
                                                                <td>{user.status}</td>
                                                                <td>{user.position.position_name}</td>
                                                                <td>{ moment(user.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                <td>{ moment(user.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                <td>
                                                                    {
                                                                        this.state.permission.includes('Update') ? 
                                                                        <button
                                                                            className="btn btn-primary w-100 my-2"
                                                                            onClick={(e) => this.setState({ userId : user.id }) }
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
                                                                            onClick={async(e) => await this.deleteUser(user.id) }
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
                                        <div id="modalUser" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                <label>Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Name..."
                                                                    value={ this.state.name }
                                                                    onChange={(e) => this.setState({ name : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Email</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Email..."
                                                                    value={ this.state.email }
                                                                    onChange={(e) => this.setState({ email : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Phone Number</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Phone Number..."
                                                                    value={ this.state.phone_number }
                                                                    onChange={(e) => this.setState({ phone_number : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Password</label>
                                                                <input
                                                                    type="password"
                                                                    className="form-control"
                                                                    placeholder={ this.state.titleModal == 'Create User' ? 'Password...' : '(Isi jika ingin ubah / reset password)' }
                                                                    value={ this.state.password }
                                                                    onChange={(e) => this.setState({ password : e.target.value }) }
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Organization</label>
                                                                <select 
                                                                    className="form-control"
                                                                    value={this.state.organization_code}
                                                                    onChange={(e) => this.setState({ organization_code : e.target.value }) }
                                                                >
                                                                    <option value="">Select Organization</option>
                                                                    { organization.map((org, key) => {
                                                                        return (
                                                                            <option key={key} value={org.organization_code}>{org.organization_name}</option>
                                                                        )
                                                                    }) }
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Roles</label>
                                                                <select 
                                                                    className="form-control"
                                                                    onChange={(e) => this.setState({ roles : e.target.value }) }
                                                                    value={this.state.roles}
                                                                >
                                                                    <option value="">Select Roles</option>
                                                                    { rolesData.map((role, key) => {
                                                                        return (
                                                                            <option key={key} value={role.roles}>{role.roles_description}</option>
                                                                        )
                                                                    }) }
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Status</label>
                                                                <select 
                                                                    className="form-control"
                                                                    onChange={(e) => this.setState({ status : e.target.value }) }
                                                                    value={ this.state.status }
                                                                >
                                                                    <option value="">Select Status</option>
                                                                    { statusType.map((status, key) => {
                                                                        return (
                                                                            <option key={key}>{status}</option>
                                                                        )
                                                                    }) }
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Position</label>
                                                                <select 
                                                                    className="form-control"
                                                                    onChange={(e) => this.setState({ position_code : e.target.value }) }
                                                                    value={this.state.position_code}
                                                                >
                                                                    <option value="">Select Position</option>
                                                                    { position.map((pos, key) => {
                                                                        return (
                                                                            <option key={key} value={pos.position_code}>{pos.position_name}</option>
                                                                        )
                                                                    }) }
                                                                </select>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={async() => await this.saveUser()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
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

export default Users;