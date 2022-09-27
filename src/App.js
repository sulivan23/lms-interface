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
import QuizContest from "./Pages/Contest/Quiz/Index";
import ResultQuizContest from "./Pages/Contest/Quiz/Result";
import QuizContestQuestion from "./Pages/Contest/Quiz/QuizContestQuestion";
import WinnerQuizContest from "./Pages/Contest/Quiz/Winner";
import MyExams from "./Pages/Exams/MyExams";
import ResultExams from "./Pages/Exams/Result";
import MyQuiz from "./Pages/Quiz/MyQuiz";
import ResultQuiz from "./Pages/Quiz/Result";
import QuizAnswer from "./Pages/Quiz/QuizAnswer";
import ExamAnswer from "./Pages/Exams/ExamAnswer";
import MyCourses from "./Pages/Courses/MyCourses";
import Learning from "./Pages/Learning/Index";
import ReportScore from "./Pages/Reporting/Score";
import ReportKeyPerformance from "./Pages/Reporting/KeyPerformance";
import SettingKeyPerformance from "./Pages/Settings/KeyPerformance";
import QuizContestAnswer from "./Pages/Contest/Quiz/QuizContestAnswer";

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
              {/* Dashboard */}
              <Route path="/home/dashboard" exact component={Dashboard} />
              {/* Courses */}
              <Route path="/home/courses" exact component={Courses} />
              <Route path="/home/my_courses" exact component={MyCourses} />
              <Route path="/home/lessons" exact component={Lessons} />
              {/* Users */}
              <Route path="/home/position" exact component={Position} />
              <Route path="/home/organization" exact component={Organization}/>
              <Route path="/home/lessons/:id/:type" exact component={LessonsForm} />
              <Route path="/home/users" exact component={Users} />
              {/* Exams */}
              <Route path="/home/exams" exact component={Exams} />
              <Route path="/home/exams/:examId/:questionNumber" exact component={ExamQuestions} />
              <Route path="/home/my_exams" exact component={MyExams} />
              <Route path="/home/result_exams" exact component={ResultExams} />
              <Route path="/home/exam_answer/:examId/:questionNumber/:result?" exact component={ExamAnswer} />
              {/* Quiz */}
              <Route path="/home/quiz" exact component={Quiz} />
              <Route path="/home/quiz/:quizId/:questionNumber" exact component={QuizQuestions} />
              <Route path="/home/my_quiz" exact component={MyQuiz} />
              <Route path="/home/result_quiz" exact component={ResultQuiz} />
              <Route path="/home/quiz_answer/:quizId/:questionNumber/:result?" exact component={QuizAnswer} />
              {/* Quiz Contest */}
              <Route path="/home/quiz_contest" exact component={QuizContest} />
              <Route path="/home/result_quiz_contest" exact component={ResultQuizContest} />
              <Route path="/home/quiz_contest/:quizContestId/:questionNumber" exact component={QuizContestQuestion} />
              <Route path="/home/winner_quiz_contest" exact component={WinnerQuizContest} />
              <Route path="/home/quiz_contest_answer/:quizContestId/:questionNumber/:result?" exact component={QuizContestAnswer} />
              {/* Learning */}
              <Route path="/home/learning/:courseId/:type/:id" exact component={Learning} />
              {/* Data Reporting */}
              <Route path="/home/reporting/score" exact component={ReportScore} />
              <Route path="/home/reporting/kpi" exact component={ReportKeyPerformance} />
              {/* Settings */}
              <Route path="/home/settings/kpi" exact component={SettingKeyPerformance} />
              {/* 404 Not Found */}
              <Route path="*" component={Error404} />
            </Switch>
            </React.Suspense>
            <Footer />
          </>
        </div>
      );
}

export default App;