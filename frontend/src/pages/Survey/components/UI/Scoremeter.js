import ReactSpeedometer from "react-d3-speedometer";
const Scoremeter = ({ score, size=200 }) => {
  const w = size * 3 / 2;
  
  return (
    <ReactSpeedometer
      maxValue={100}
      value={score}
      needleColor="blue"
      startColor="red"
      segments={10}
        endColor="green"
          height={size}
          width={w}
    />
  );
};
export default Scoremeter;
