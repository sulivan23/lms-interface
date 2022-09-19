import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createPosition, deletePosition, getPermission, getPosition, getPositionCode, updatePosition } from "../../api/Users";
import $ from "jquery";
import iziToast from "izitoast";
import swal from "sweetalert";
import { getPersonalInfo, handleMessage } from "../../api/Helper";
import moment from "moment";
import Cookies from "js-cookie";


class Position extends Component {

    constructor(props){
        super(props);
        this.state = {
            position_code : '',
            position_name : '',
            position_description : '',
            position_code_edit : '',
            onSubmit : false,
            positionData : [],
            permission : [],
            titleModal : 'Create Position'
        }
    }

    async componentDidMount() {
        await getPersonalInfo();
        await this.getPosition();
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
        if(prevState.position_code_edit != this.state.position_code_edit
        && this.state.position_code_edit != ''){
            const position = await getPositionCode(this.state.position_code_edit);
            this.setState({
                position_code : position.data.position_code,
                position_name : position.data.position_name,
                position_description : position.data.position_description,
                titleModal : 'Update Position'
            });
            this.initModal();
        }
    }

    async savePosition() {
        try {
            const data = {
                position_code : this.state.position_code,
                position_name : this.state.position_name,
                position_description : this.state.position_description
            }
            this.setState({ onSubmit : true });
            setTimeout(async() => {
                var save;
                if(this.state.position_code_edit != ''){
                    save = await updatePosition(data, this.state.position_code_edit);
                }else { 
                    save = await createPosition(data);
                }
                if(save.is_error == false){
                    iziToast.success({
                        title : 'Success!',
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                    await this.getPosition();
                    await this.closeModal();
                }else {
                    iziToast.warning({
                        message : handleMessage(save.message),
                        position : 'topRight'
                    });
                }
                this.setState({ onSubmit : false });
            }, 1000);
        } catch(err){
            console.log(err);
        }
    }

    async deletePosition(code) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this position",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async(willDelete) => {
            if(willDelete){
                const deleted = await deletePosition(code);
                if(deleted.is_error == false){
                    await this.getPosition();
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

    async getPosition() {
        const position = await getPosition();
        this.setState({ positionData : position.data });
    }

    async initModal(){
        $("#modalPosition").modal('show');
    }

    async closeModal() {
        this.setState({
            position_code : '',
            position_name : '',
            position_description : '',
            position_code_edit : '',
            titleModal : 'Create Position'
        });
        $("#modalPosition").modal('hide');
    }

    render() {

        const { positionData } = this.state;

        return (
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                    <h1>Position</h1>
                        <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active">
                                <Link to="/home">Dashboard</Link>
                            </div>
                            <div className="breadcrumb-item">Users</div>
                            <div className="breadcrumb-item">Position</div>
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
                                                &nbsp;Create Position
                                            </button>
                                            :
                                            ''
                                        }
                                        <div className="table table-responsive">
                                        <table className="table table-striped" id="dataTable">
                                            <thead>
                                                <tr>
                                                    <th>Position Code</th>
                                                    <th>Position Name</th>
                                                    <th>Position Descripion</th>s
                                                    <th>Created At</th>
                                                    <th>Updated At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    positionData.map((pos, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{pos.position_code}</td>
                                                                <td>{pos.position_name}</td>
                                                                <td>{pos.position_description}</td>
                                                                <td>{ moment(pos.createdAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                <td>{ moment(pos.updatedAt).format('Y-MM-DD HH:mm:ss') }</td>
                                                                <td>
                                                                    {
                                                                        this.state.permission.includes('Update') ?
                                                                        <button
                                                                            className="btn btn-primary w-100 my-2"
                                                                            onClick={(e) => this.setState({ position_code_edit : pos.position_code }) }
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
                                                                            onClick={async(e) => await this.deletePosition(pos.position_code) }
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
                                    <div id="modalPosition" className="modal fade shadow-lg my-4" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                            <label>Position Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Position Code..."
                                                                value={ this.state.position_code }
                                                                onChange={(e) => this.setState({ position_code : e.target.value }) }
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Position Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Position Name..."
                                                                value={ this.state.position_name }
                                                                onChange={(e) => this.setState({ position_name : e.target.value }) }
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Position Description</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Position Description..."
                                                                value={ this.state.position_description }
                                                                onChange={(e) => this.setState({ position_description : e.target.value }) }
                                                            />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-warning" onClick={async() => this.closeModal()}>Close</button>
                                                    <button type="button" className="btn btn-primary" onClick={async() => await this.savePosition()} >{this.state.onSubmit ? <div><i className="fa fa-spinner fa-spin"></i> Loading...</div> : 'Submit'}</button>
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

export default Position;