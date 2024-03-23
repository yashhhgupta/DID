import styles from "./styles.module.css";
import { LineGraph, Pie } from "../UI";
import { useSelector } from "react-redux";
import { useRequest } from "../../../../hooks/useRequest";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../consts";

const Dashbody = ({ department, team }) => {
  const { sendRequest } = useRequest();
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [orgData, setOrgData] = useState(null);
  useEffect(() => {
    const fetchOrgData = async () => {
      let url = BASE_URL + "/diversity/get/" + orgId;
      if (department) {
        url += "/" + department.value;
        if (team) {
          url += "/" + team.value;
        }
      }
      const response = await sendRequest(url, "GET", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });
      if (!response) return;
      else setOrgData(response);
    };
    fetchOrgData();
  }, [department, team]);
  if (!orgData) return <div>Loading...</div>;
  let visibility = orgData.dataVisibility;
  return (
    <div className={styles.container}>
      {isAdmin && (
        <>
          <LineGraph
            selectedDep={department}
            selectedTeam={team}
            isAdmin={isAdmin}
            visibility={orgData.dataVisibility["diversityScore"]}
          />
          <div className={styles.pies}>
            {orgData.diversityData.map((data, index) => {
              return (
                <Pie
                  key={index}
                  data={data}
                  dataVisibility={orgData.dataVisibility}
                  isAdmin={isAdmin}
                />
              );
            })}
          </div>
        </>
      )}
      {!isAdmin && (
        <>
          {visibility["diversityScore"] && (
            <LineGraph
              selectedDep={department}
              selectedTeam={team}
              visibility={orgData.dataVisibility["diversityScore"]}
              isAdmin={isAdmin}
            />
          )}
          <div className={styles.pies}>
            {orgData.diversityData.map((data, index) => {
              if (!visibility[data.k])
                return;
              return (
                <Pie
                  key={index}
                  data={data}
                  dataVisibility={orgData.dataVisibility}
                  isAdmin={isAdmin}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default Dashbody;
