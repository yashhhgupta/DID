import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const CircularProgr = ({percentage}) => {
  return (
    <CircularProgressbar
      value={percentage}
      text={`${percentage}`}
      styles={{
        root: {},
        path: {
          stroke: `rgb(3,89,224)`,
          strokeLinecap: "butt",
        },
        trail: {
          stroke: "#f5f5f5",
        },
        text: {
          fill: "rgb(3,89,224)",
          fontSize: "16px",
        },
      }}
    />
  );
};
export default CircularProgr;
