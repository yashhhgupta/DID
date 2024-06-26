import {
  Home,
  Dashboard,
  SurveyAdmin,
  SurveyEmployee,
  Teams,
  Error,
  Login,
  Signup,
  ProfileEmp,
  ProfileAdmin,
  Employees,
} from "./pages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { login, logout } from "./store/auth-slice";
import { useDispatch } from "react-redux";
import { Loader } from "./Components/common";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isLoading = useSelector((state) => state.loader.isLoading);
  // const userId = useSelector((state) => state.auth.userId);
  // const orgId = useSelector((state) => state.auth.orgId);
  // const token = useSelector((state) => state.auth.token);
  let token = Cookies.get("token");
  useEffect(() => {
    if (token) {
      let id = Cookies.get("userId");
      let orgId = Cookies.get("orgId");
      dispatch(
        login({
          userId: id,
          orgId: orgId,
          token: token,
        })
      );
    } else {
      if (isLoggedIn) {
        logout();
        Cookies.remove("userId");
        Cookies.remove("orgId");
        window.location.reload();
      }
    }
  }, [token]);
  let routes;
  if (!isLoggedIn) {
    routes = (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  } else {
    if (isAdmin) {
      routes = (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/survey" element={<SurveyAdmin />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/profile" element={<ProfileAdmin />} />
              <Route path="/employees" element={<Employees />} />
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
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/survey" element={<SurveyEmployee />} />
              <Route path="*" element={<Error />} />
              <Route path="/profile" element={<ProfileEmp />} />
            </Routes>
          </Layout>
        </Router>
      );
    }
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      {routes}
    </>
  );
}

export default App;
