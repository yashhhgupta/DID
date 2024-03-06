import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const DUMMY_DATA = [
  {
    title: "Survey 1",
    participation: "50%",
    inclusionScore: "80",
  },
  {
    title: "Survey 2",
    participation: "60%",
    inclusionScore: "95",
  },
  {
    title: "Survey 3",
    participation: "70%",
    inclusionScore: "40",
  },
  {
    title: "Survey 4",
    participation: "80%",
    inclusionScore: "50",
  },
  {
    title: "Survey 5",
    participation: "90%",
    inclusionScore: "80",
  },
];
const Graph = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={DUMMY_DATA} title={"Last 5 Surveys"}>
        <XAxis
          dataKey="title"
          label={{
            value: "random text",
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
