import { Chart } from "react-google-charts";
import { Card } from "../../../../Components/common";
export const DUMMY_DATA = [
  ["Gender", "Count"],
  ["Male", 70],
  ["Female", 12],
  ["Other", 3],
];

export const options = {
  is3D: true,
};
const Pie = ({data}) => {
  let graphData = convertData(data.v,data.k);
  console.log("temp", graphData);
  console.log("dummy", DUMMY_DATA);
  console.log("data", data);
  return (
    <Card>
      <div
        style={{
          color: "var(--color-extra)",
          fontSize: "1.7rem",
          fontWeight: "bold",
          padding: "0rem",
        }}
      >
        {data.k}
      </div>
      <Chart
        chartType="PieChart"
        data={graphData}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </Card>
  );
};
export default Pie;

function convertData(data,key) {
  // Create a new array with headers
  const result = [["Count", key]];

  // Iterate through the original data
  data.forEach((item) => {
    // Push count and gender values into result array
    if (!item[key]) {
      item[key] = "Not Specified";
    }
    result.push( [item[key],item.count]);
  });

  return result;
}
