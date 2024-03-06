import ReactSpeedometer from "react-d3-speedometer";
const Scoremeter = ({ score, size=200 }) => {
  const w = size * 3 / 2;
  
  return (
    <ReactSpeedometer
      maxValue={100}
      value={score}
      needleColor="black"
      startColor="#71CEFF"
      segments={6}
      endColor="blue"
      height={size}
      width={w}
    />
  );
};
export default Scoremeter;
