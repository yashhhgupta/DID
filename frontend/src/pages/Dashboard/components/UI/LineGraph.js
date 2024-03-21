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
import { useRequest } from "../../../../hooks/useRequest";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../consts";
import { useSelector } from "react-redux";
import Loader from "../../../../assets/lineload.gif";

const LineGraph = ({ selectedDep, selectedTeam }) => {
  const { sendRequest } = useRequest();
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  const [orgData, setOrgData] = useState(null);
  useEffect(() => {
    const fetchOrgData = async () => {
      setOrgData(null);
      let url = BASE_URL + "/diversity/getScore/" + orgId;
      if (selectedDep) {
        url += "/" + selectedDep.value;
        if (selectedTeam) {
          url += "/" + selectedTeam.value;
        }
      }
      const response = await sendRequest(url, "GET", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });
      if (!response) return;
      else setOrgData(response.diversityData);
    };
    fetchOrgData();
  }, [selectedDep, selectedTeam]);
  if (!orgData)
    return (
    <Card>
      
      <div className={styles.linegraph}>
        <img src={Loader} className={styles.image} />
        </div>
        </Card>
    );
  return (
    <Card>
      <div className={styles.linegraph}>
        <ResponsiveContainer width="95%" height="100%">
          <LineChart data={orgData}>
            <XAxis dataKey="label" />
            <YAxis type="number" domain={[50, 60]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
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
