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
import ToggleButton from "react-toggle-button";
import { toast } from "sonner";

const LineGraph = ({
  selectedDep,
  selectedTeam,
  visibility,
  isAdmin = false,
}) => {
  const [toggle, setToggle] = useState(visibility);
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
  const ToggleChangeHandler = async (value) => {
    setToggle(value);
    let url = BASE_URL + "/admin/updateDataVisibility";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        orgId: orgId,
        field: "diversityScore",
        visibility: value,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    );
    if (!response) {
      toast.error("Data Visibility Update Failed,please try again later.");
    } else {
      toast.success("Data Visibility Updated Successfully.");
    }
  };

  return (
    <Card>
      <div className={styles.heading}>
        <h1>Diversity Score</h1>
        {isAdmin && (
          <div className={styles.horz}>
            <div>Visible to Employees </div>
            <ToggleButton
              value={toggle}
              onToggle={(value) => {
                ToggleChangeHandler(!value);
              }}
            />
          </div>
        )}
      </div>
      {!orgData && (
        <div className={styles.linegraph}>
          <img src={Loader} className={styles.image} />
        </div>
      )}
      {orgData && orgData.length === 0 && (
        <div
          style={{
            color: "var(--color-extra)",
            fontSize: "1.7rem",
            fontWeight: "bold",
            padding: "1rem 2rem",
          }}
        >
          No data available
        </div>
      )}
      {orgData && orgData.length !== 0 && (
        <div className={styles.linegraph}>
          <ResponsiveContainer width="95%" height="100%">
            <LineChart data={orgData}>
              <XAxis dataKey="label" />
              <YAxis type="number" domain={[50, 70]} />
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
      )}
    </Card>
  );
};
export default LineGraph;
