import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";
import Error from "./pages/Error";
import Teams from "./pages/Teams";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
