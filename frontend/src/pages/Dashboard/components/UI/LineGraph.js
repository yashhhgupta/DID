import { Card } from "../../../../Components/common";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./styles.module.css";

const data = [
  {
    name: "Page A",
    uv: 40,
  },
  {
    name: "Page B",
    uv: 30,
  },
  {
    name: "Page C",
    uv: 20,
  },
  {
    name: "Page D",
    uv: 27,
  },
  {
    name: "Page E",
    uv: 81,
  },
  {
    name: "Page F",
    uv: 23,
  },
  {
    name: "Page G",
    uv: 94,
  },
];

const LineGraph = () => {
  return (
    <Card>
      <div className={styles.linegraph}>
        <ResponsiveContainer width="95%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#0359E0"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default LineGraph;
