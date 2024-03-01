import { Home, Dashboard, Survey, Teams, Error, Login, Signup } from "./pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import { useAuth } from "./context/authcontext";
import { useEffect } from "react";
import Cookies from "js-cookie";

function App() {
  const { isloggedIn, isAdmin,login } = useAuth();
  useEffect(() => { 
    let token = Cookies.get("token");
    if (token) {
      let id = Cookies.get("userId");
      let isAdmin = Cookies.get("isAdmin");
      login(id,isAdmin,token);
    }
  },[])
  let routes;
  if (!isloggedIn) {
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
              <Route path="/survey" element={<Survey />} />
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
              <Route path="/survey" element={<Survey />} />
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
