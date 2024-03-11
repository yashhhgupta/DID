import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { BASE_URL } from "../../consts";
import { PrimaryData, SecondaryData } from "./components";
import { useDispatch } from "react-redux";
import { getDepartments } from "../../store/department-slice";

const Profile = () => {
  const { sendRequest, isLoading } = useRequest();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const orgId = useSelector((state) => state.auth.orgId);
  const status = useSelector((state) => state.department.status);
  const [user, setUser] = useState(null);
  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
    const getUser = async () => { 
      let url = BASE_URL + "/user/get/" + userId;
      const response = await sendRequest(
        url,
        "GET",
       null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
      if (!response) {
        alert("Invalid Credentials, Try Again");
      } else {
        
        setUser(response.user);
      }
    };
    getUser();
  }, []);
  if(isLoading || !user || status === "loading" || status === "idle"){
    return <div>Loading...</div>
  }
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>PROFILE</h1>
      </div>
      <PrimaryData user={user} />
      <SecondaryData user={user} />
    </div>
  );
};
export default Profile;
