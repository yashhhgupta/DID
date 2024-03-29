import { Chart } from "react-google-charts";
import { Card } from "../../../../Components/common";
import { diversityMapping } from "./utils";
import styles from "./styles.module.css";
import ToggleButton from "react-toggle-button";
import { useState } from "react";
import { useRequest } from "../../../../hooks/useRequest";
import { BASE_URL } from "../../../../consts";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Tooltip as Tootltip2 } from "react-tooltip";

export const options = {
  is3D: true,
};
const Pie = ({ data, dataVisibility, isAdmin = false }) => {
  const { sendRequest } = useRequest();
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  let graphData = convertData(data.v, data.k);
  const [toggle, setToggle] = useState(dataVisibility[data.k]);
  const ToggleChangeHandler = async (value) => {
    setToggle(value);
    let url = BASE_URL + "/admin/updateDataVisibility";
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({
        orgId: orgId,
        field: data.k,
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
        <h1>{diversityMapping[data.k]}</h1>
        {isAdmin && (
          <div className={styles.horz}>
            <Tootltip2 id="pie-tooltip" place="bottom" />
            <a
              data-tooltip-id="pie-tooltip"
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

function convertData(data, key) {
  // Create a new array with headers
  const result = [["Count", key]];

  // Iterate through the original data
  data.forEach((item) => {
    // Push count and gender values into result array
    if (!item[key]) {
      item[key] = "Not Specified";
    }
    result.push([item[key], item.count]);
  });

  return result;
}
