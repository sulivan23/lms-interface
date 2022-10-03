import Cookies from "js-cookie";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import { getOrganization } from "../../api/Organization";
import { getPermission, getRoles } from "../../api/Users";
import moment from "moment";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast";
import { createPermission, deletePermission, getMenu, getModul, getPermissionById, getPermissions, updatePermission } from "../../api/Settings";

class RolesPermission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permissionId : '',
            roles : '',
            flagId : '',
            permission : [],
            data : [],
            role : [],
            roleName : '',
            url : '',
            type : '',
            modulMenu : '',
            permissionType : ['Create', 'Read', 'Update', 'Delete'],
            permissionValue : [],
            type : '',
            modul : [],
            listModulMenu : [],
            onSubmit : false,
            titleModal : 'Create Permission',
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
        this.setState({
            permission : permission.data.permission.split(', ')
        });
        $("#dataTable").DataTable({
            order : [['0', 'desc']],
            pageLength : 10
        });
    }

    async getData() {
        const data = await getPermissions();
        this.setState({ data : data.data });
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.permissionId != this.state.permissionId && this.state.permissionId != ''){
            const permission = await getPermissionById(this.state.permissionId);
            var arr = [];
            var data = permission.data[0].permission;
            var split = data.split(', ');
            for(var i = 0; i < split.length; i++){
                arr.push(split[i]);
            }
            console.log(arr);
            this.setState({
                roleName : permission.data[0].role_name,
                url : permission.data[0].url,
                type : permission.data[0].type,
                modulMenu : permission.data[0].name,
                permissionValue : arr,
                titleModal : 'Update Permission'
            });
            await this.initModal();
        }
    }

    async initModal() {
        if(this.state.role.length == 0 && this.state.permissionId == ''){
            const role = await getRoles();
            this.setState({ role : role.data });
        }
        $("#modalPermission").modal('show');
    }

    async closeModal() {
        this.setState({
            roleName : '',
            url : '',
            type : '',
            flagId : '',
            roles : '',
            modulMenu : '',
            permissionValue : [],
            titleModal : 'Create Permission',
            permissionId : ''
        })
        $("#modalPermission").modal('hide');
    }

    async saveData() {
        try {
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var data = {};
                var save;
                if(this.state.permissionId != ''){
                    data =  {
                        permission : this.state.permissionValue.join(', ')
                    }
                    save = await updatePermission(data, this.state.permissionId);
                }else { 
                    data = {
                        roles : this.state.roles,
                        id : this.state.flagId,
                        permission : this.state.permissionValue.length > 0 ? this.state.permissionValue.join(', ') : '',
                        type : this.state.type
                    };
                    save = await createPermission(data);
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
            text: "Once deleted, you will not be able to recover this permission",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deletePermission(id);
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

    setPermissionValue(isChecked, Value){
        var arr = this.state.permissionValue;
        if(isChecked && !this.state.permissionValue.includes(Value)){
            arr = [...arr, Value];
        }else {
            var foundIndex = arr.findIndex(x => x == Value);
            arr.splice(foundIndex, 1);
        }
        this.setState({ permissionValue : arr });
    }

    async onChangeType(type) {
        this.setState({ type : type });
        var data = [];
        if(type == 'Modul'){
            const modul = await getModul();
            modul.data.map((mod, i) => {
                data.push({
                    id : mod.id,
                    name : mod.modul_name
                })
            });
        }else {
            const menu = await getMenu();
            menu.data.map((men, i) => {
                data.push({
                    id : men.id,
                    name : men.menu_name
                })
            })
        }
        this.setState({ listModulMenu : data });
    }

    render() {
        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Setting Roles Permission</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Settings</div>
                            <div className="breadcrumb-item">Roles & Permission</div>
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
                                                &nbsp;Create Permission
                                            </button>
                                            :
                                            ''
                                        }
                                        <div className="table table-responsive">
                                            <table className="table table-striped" id="dataTable">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Role Code</th>
                                                        <th>Role Name</th>
                                                        <th>Modul/Menu Name</th>
                                                        <th>URL</th>
                                                        <th>Type</th>
                                                        <th>Permission</th>
                                                        <th>Created At</th>
                                                        <th>Updated At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.data.map((data, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{data.id}</td>
                                                                    <td>{data.roles}</td>
                                                                    <td>{data.role_name}</td>
                                                                    <td>{data.name}</td>
                                                                    <td>{data.url}</td>
                                                                    <td>{data.type}</td>
                                                                    <td>{data.permission}</td>
                                                                    <td>{ moment(data.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>{ moment(data.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                    <td>
                                                                        {
                                                                            this.state.permission.includes('Update') ?
                                                                            <button
                                                                                className="btn btn-primary w-100 my-2"
                                                                                onClick={(e) => this.setState({ permissionId : data.id }) }
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
                                                                                onClick={async() => await this.deleteData(data.id) }
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
                                        <div id="modalPermission" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                            {
                                                                this.state.permissionId != '' ? 
                                                                <div>
                                                                    <div className="form-group">
                                                                        <label>Role Name</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={ this.state.roleName }
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>Modul / Menu Name</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={ this.state.modulMenu }
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>URL</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={ this.state.url }
                                                                            disabled={true}
                                                                        />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>Type</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={ this.state.type }
                                                                            disabled={true}
                                                                        />
                                                                    </div>  
                                                                </div>
                                                                : 
                                                                <div>
                                                                    <div className="form-group">
                                                                        <label>Role</label>
                                                                        <select
                                                                            className="form-control"
                                                                            value={this.state.roles}
                                                                            onChange={(e) => this.setState({ roles : e.target.value })}
                                                                            >
                                                                                <option value="">Select Role</option>
                                                                                {
                                                                                    this.state.role.map((role, key) => {
                                                                                        return (
                                                                                            <option key={key} value={role.roles}>{role.roles_description}</option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>Type</label>
                                                                        <select
                                                                            className="form-control"
                                                                            value={this.state.type}
                                                                            onChange={async(e) => await this.onChangeType(e.target.value)}
                                                                            >
                                                                                <option value="">Select Type</option>
                                                                                <option value="Menu">Menu</option>
                                                                                <option value="Modul">Modul</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>List Modul / Menu</label>
                                                                        <select
                                                                            className="form-control"
                                                                            value={this.state.flagId}
                                                                            onChange={(e) => this.setState({ flagId : e.target.value })}
                                                                            >
                                                                                <option value="">Select Data</option>
                                                                                {
                                                                                    this.state.listModulMenu.map((modulMenu, key) => {
                                                                                        return (
                                                                                            <option value={modulMenu.id}>{modulMenu.name}</option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            }
                                                            <div className="form-group">
                                                                <label>Permission</label>
                                                                {
                                                                    this.state.permissionType.map((val, key) => {
                                                                        return (
                                                                            <div>
                                                                                <input 
                                                                                    key={key} 
                                                                                    type="checkbox" 
                                                                                    onChange={(e) => this.setPermissionValue(e.target.checked, val)}  
                                                                                    checked={this.state.permissionValue.includes(val) ? true : false}
                                                                                />
                                                                                {' '}
                                                                                <label>{val}</label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
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

export default RolesPermission;