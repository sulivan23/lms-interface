import Login from "./Pages/Auth/Login";
import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Header, Footer, Sidebar } from "./components/admin";
import { useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";

const history = React.lazy(() => import('./history'));

function App() {
    
    let location = useLocation().pathname;
    let locationSplit = location.split("/");
    let locationParent = locationSplit[1];
    let WithoutRouter = [""];

    return (
        <div className="App">
          <> 
            {!WithoutRouter.includes(locationParent) ? (
              <>
                <Header />
                <Sidebar />
              </>
            ) : (
              ""
            )}
            <React.Suspense fallback={<h1>Still Loading…</h1>}>
            <Switch history={history}>
              <Route path="/" exact component={Login} />
              <Route path="/home" exact component={Dashboard} />
            </Switch>
            </React.Suspense>
            <Footer />
          </>
        </div>
      );
}

export default App;