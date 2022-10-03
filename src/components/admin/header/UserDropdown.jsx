import Cookies from "js-cookie";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export class UserDropdown extends Component {

  roleDescription(role) {
    var arr = {
      "CBT" : 'Contributor',
      "ADM" : 'Administrator',
      "HRD" : 'Human Resources',
      "CMO" : 'User',
      "SPV" : 'Supervisor'
    }
    return arr[role];
  }

  render() {
    const { userDetail } = this.props;
    return (
      <li className="dropdown">
        <a
          href="#"
          data-toggle="dropdown"
          className="nav-link dropdown-toggle nav-link-lg nav-link-user"
        >
          <img
            alt="image"
            src={userDetail.userImg}
            className="rounded-circle mr-1"
          />
          <div className="d-sm-none d-lg-inline-block">
            Hi, {Cookies.get('name')}
          </div>
        </a>
        <div className="dropdown-menu dropdown-menu-right">
          <div className="dropdown-title">
            Your login as {this.roleDescription(Cookies.get('role'))}
          </div>

          {userDetail.datas.map((data, idata) => {
            return (
              <NavLink
                key={idata}
                to={data.link}
                activeStyle={{
                  color: "#6777ef",
                }}
                exact
                className="dropdown-item has-icon"
              >
                <i className={data.icode} /> {data.title}
              </NavLink>
            );
          })}

          <div className="dropdown-divider" />
          {/* <a
            href="#"
            className="dropdown-item has-icon text-danger"
            // onClick={() => {
            //   Auth.logout(() => {
            //     window.location.reload();
            //   });
            // }}
          >
            <i className={userDetail.logoutIcon} /> {userDetail.logoutTitle}
          </a> */}
        </div>
      </li>
    );
  }
}

export default UserDropdown;
