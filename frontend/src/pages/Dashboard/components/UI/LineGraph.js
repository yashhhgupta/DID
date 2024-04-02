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
import { customStyles } from "../../../../consts";
import Select from "react-select";
import { yearOptions } from "./utils";
import { Tooltip as Tootltip2 } from "react-tooltip";

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
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [customYearOptions, setCustomYearOptions] = useState(yearOptions);
  const [orgData, setOrgData] = useState(null);
  const [max, setMax] = useState(40);
  const [min, setMin] = useState(65);
  useEffect(() => {
    const fetchOrgData = async () => {
      setOrgData(null);
      let url = BASE_URL + "/diversity/getScore/" + orgId;
      if (selectedDep) {
        url += `?depId=${selectedDep.value}`;
        if (selectedTeam) {
          url += `&teamId=${selectedTeam.value}`;
        }
      }
      const response = await sendRequest(url, "POST", JSON.stringify({
        startYear: startYear ? startYear.value : null,
        endYear: endYear ? endYear.value : null,
      }), {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });
      if (!response) return;
      else {
        setOrgData(response.diversityData)
        let max = response.diversityData.reduce((max, p) => p.score > max ? p.score : max, response.diversityData[0].score);
        let min = response.diversityData.reduce((min, p) => p.score < min ? p.score : min, response.diversityData[0].score);
        setMax(Math.ceil(max));
        setMin(Math.ceil(min));
      };
    };
    if ((startYear && endYear)||(!startYear && !endYear))
    fetchOrgData();
  }, [selectedDep, selectedTeam,endYear,startYear]);
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
  const yearChangeHandler = (e) => {
    if (!e) {
      setStartYear(null);
      setEndYear(null);
      return;
    
    };
    setStartYear(e);
    setEndYear(null);
    let customOptions = yearOptions.filter((option) => {
      return option.value > e.value && option.value.getFullYear() - e.value.getFullYear() >= 3;
    });
    setCustomYearOptions(customOptions);
  }
  
  return (
    <Card>
      <div className={styles.heading}>
        <h1>Diversity Score</h1>
        <div className={styles.yearOptions}>
          <Select
            style={customStyles}
            options={yearOptions}
            placeholder="Select start year"
            onChange={yearChangeHandler}
            value={startYear}
            isClearable={true}
          />
          <Select
            style={customStyles}
            options={customYearOptions}
            placeholder="Select end year"
            onChange={(e) => {
              setEndYear(e);
            }}
            value={endYear}
            isClearable={true}
            isDisabled={!startYear}
          />
          {isAdmin && (
            <div className={styles.horz}>
              <Tootltip2 id="graph-tip" place="top" />
              <a
                data-tooltip-id="graph-tip"
                data-tooltip-variant="info"
                data-tooltip-content="Visible to employees"
              >
                {" "}
                <ToggleButton
                  value={toggle}
                  onToggle={(value) => {
                    ToggleChangeHandler(!value);
                  }}
                />
              </a>
            </div>
          )}
        </div>
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
              <YAxis type="number" domain={[min-1, max]} />
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
