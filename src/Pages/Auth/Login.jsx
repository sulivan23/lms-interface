import React, { useState } from "react";
import axios from "axios";
import iziToast from "izitoast";
import { getCookie, handleMessage } from "../../helpers/Helper";
import { useHistory } from "react-router";
import Cookies from "js-cookie";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const Auth = async(e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      await axios.post('http://localhost:3001/auth/login', {
        email : email,
        password : password
      }).then((res) => {
        var err = res.data.is_error;
        if(err == true) {
          return iziToast.warning({
            title: "Warning!",
            message: handleMessage(res.data.message),
            position: "topRight",
          });
        }
        Cookies.set('userId', res.data.data.user_id);
        history.push('/dashboard');
      })
    } catch(err) {
      console.log(err);
      return iziToast.error({
        title: "Error!",
        message: err.message,
        position: "topRight",
      });
    }
  }
  
  return (
    <div id="app">
      <section className="section">
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
              <div className="login-brand">
                <p>AMT Learning Management System</p>
              </div>

              <div className="card card-primary">
                <div className="card-header">
                  <h4>Login</h4>
                </div>

                <div className="card-body">
                  <form onSubmit={Auth}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="text"
                        className="form-control"
                        name="email"
                        tabIndex="1"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="invalid-feedback">
                        Please fill in your email
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="d-block">
                        <label htmlFor="password" className="control-label">
                          Password
                        </label>
                      </div>
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        name="password"
                        tabIndex="2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value) }
                      />
                      <div className="invalid-feedback">
                        please fill in your password
                      </div>
                    </div>

                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        tabIndex="4"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="simple-footer">
                Copyright &copy; by Irvan 2022
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;