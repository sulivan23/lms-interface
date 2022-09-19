import Login from "./Pages/Auth/Login";
import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Header, Footer, Sidebar } from "./components/admin";
import { useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Index";
import Courses from "./Pages/Courses/Courses";
import Error404 from "./Pages/Errors/404";
import Position from "./Pages/Users/Position";
import Organization from "./Pages/Users/Organization";
import Users from "./Pages/Users/Index";
import Lessons from "./Pages/Lessons/Lessons";
import LessonsForm from "./Pages/Lessons/LessonsForm";
import Exams from "./Pages/Exams/Index";
import Quiz from "./Pages/Quiz/Index";
import ExamQuestions from "./Pages/Exams/ExamQuestions";
import QuizQuestions from "./Pages/Quiz/QuizQuestions";

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
              <Route path="/home/dashboard" exact component={Dashboard} />
              <Route path="/home/courses" exact component={Courses} />
              <Route path="/home/position" exact component={Position} />
              <Route path="/home/organization" exact component={Organization}/>
              <Route path="/home/lessons" exact component={Lessons} />
              <Route path="/home/lessons/:id/:type" exact component={LessonsForm} />
              <Route path="/home/users" exact component={Users} />
              <Route path="/home/exams" exact component={Exams} />
              <Route path="/home/exams/:examId/:questionNumber" exact component={ExamQuestions} />
              <Route path="/home/quiz" exact component={Quiz} />
              <Route path="/home/quiz/:quizId/:questionNumber" exact component={QuizQuestions} />
              <Route path="*" component={Error404} />
            </Switch>
            </React.Suspense>
            <Footer />
          </>
        </div>
      );
}

export default App;