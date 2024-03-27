import ErrorImg from "../assets/error.jpg";
import { useNavigate } from "react-router-dom";
const Error = () => {
    const navigate = useNavigate();
    const naviagteHandler = () => { 
        navigate("/");
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "85vh",
        }}
      >
        <img
          src={ErrorImg}
          alt="Error"
          style={{
            height: "60%",
            mixBlendMode: "multiply",
          }}
        />
        <h1>404 Not Found</h1>
        <h3>
          Go to{" "}
                <span onClick={naviagteHandler} style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
          }}>Home Page</span>
        </h3>
      </div>
    );
}
export default Error;