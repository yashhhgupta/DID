import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { FaPoll } from "react-icons/fa";
const options = [
  {
    title: "Home",
    icon: <FaHome />,
    redirect: "/",
  },
  {
    title: "Dashboard",
    icon: <MdDashboard />,
    redirect: "/dashboard",
  },
  {
    title: "Teams",
    icon: <MdGroups />,
    redirect: "/teams",
  },
  {
    title: "Survey",
    icon: <FaPoll />,
    redirect: "/survey",
  },
];

export default options;
