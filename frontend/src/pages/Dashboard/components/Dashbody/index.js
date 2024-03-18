import styles from "./styles.module.css";
import { LineGraph, Pie } from "../UI";
import { useSelector } from "react-redux";
import { useRequest } from "../../../../hooks/useRequest";
import { useEffect ,useState} from "react";
import { BASE_URL } from "../../../../consts";

const Dashbody = ({department,team}) => {
  const { sendRequest } = useRequest();
  const orgId = useSelector((state) => state.auth.orgId);
  const token = useSelector((state) => state.auth.token);
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
      else setOrgData(response.diversityData);
    };
    fetchOrgData();
    console.log("called");
  }, [department,team]);
    if (!orgData) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <LineGraph />
      <div className={styles.pies}>
        {
            orgData.map((data, index) => {
                return <Pie key={index} data={data} />
            })
        }
      </div>
    </div>
  );
};
export default Dashbody;
