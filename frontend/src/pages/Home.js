import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../store/department-slice";

const Home = () => {
    const dispatch = useDispatch();
    const orgId = useSelector((state) => state.auth.orgId);
    const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(getDepartments({ orgId, token }));
  }, []);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};
export default Home;
