import React, { Component, useState } from "react";
import { handleMessage } from "../../api/Helper";
import { AuthLogin } from "../../api/Auth";
// import { useHistory } from "react-router";
import Cookies from "js-cookie";
import iziToast from "izitoast";
import { useHistory } from "react-router";

export const Login = () =>  {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin  = async(e) => {
    try {
        e.preventDefault();
        setLoading(true);
        const login = await AuthLogin(`${email}`, `${password}`);
        var err = login.data.is_error;
        if(err == true) {
          setTimeout(() => {
            setLoading(false);
            return iziToast.warning({
              title: "Warning!",
              message: handleMessage(login.data.message),
              position: "topRight",
            });
          }, 1000)
        }else{
          Cookies.set('userId', login.data.data.user_id);
          Cookies.set('name', login.data.data.name);
          Cookies.set('email', login.data.data.email);
          Cookies.set('role', login.data.data.role);
          history.push('/dashboard');
        }
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
                  <form>
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
                        onClick={handleLogin}
                      >
                        {loading == true ? 'Loading...' : 'Login'}
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