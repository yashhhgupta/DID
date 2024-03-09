import {
  Home,
  Dashboard,
  SurveyAdmin,
  SurveyEmployee,
  Teams,
  Error,
  Login,
  Signup,
} from "./pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { login } from "./store/auth-slice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  // const userId = useSelector((state) => state.auth.userId);
  // const orgId = useSelector((state) => state.auth.orgId);
  // const token = useSelector((state) => state.auth.token);
  useEffect(() => { 
    let token = Cookies.get("token");
    if (token) {
      let id = Cookies.get("userId");
      let orgId = Cookies.get("orgId");
      dispatch(login(
        {
          userId: id,
          orgId: orgId,
          token: token,
        }
      ))
    }
  },[])
  let routes;
  if (!isLoggedIn) {
    routes = (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    );
  } else {
    if (isAdmin) {
      routes = (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/survey" element={<SurveyAdmin />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Layout>
        </Router>
      );
    } else {
      routes = (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/survey" element={<SurveyEmployee />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Layout>
        </Router>
      );
    }
  }
  return <>{routes}</>;
}

export default App;
