import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
const Graph = () => {
  const surveys = useSelector((state) => state.survey.survey);
  let updated = [...surveys]
  updated.sort((a, b) => {
    return new Date(b.createdOn) - new Date(a.createdOn);
  });
  const last5Surveys = updated.slice(0, 5);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={last5Surveys} title={"Last 5 Surveys"}>
        <XAxis
          dataKey="title"
          style={{ fontSize: "12px", wordWrap: "break-word" }}
          label={{
            position: "insideBottomRight",
            offset: -20,
          }}
        />
        <YAxis type="number" domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="inclusionScore" fill="#0359E0" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default Graph;
