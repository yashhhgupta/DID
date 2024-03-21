import { MdDashboard } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { FaPoll } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
const optionsAdmin = [
  {
    title: "Dashboard",
    icon: <MdDashboard />,
    redirect: "/dashboard",
  },
  {
    title: "Employees",
    icon: <FaUserTie />,
    redirect: "/employees",
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
const optionsEmp = [
  {
    title: "Dashboard",
    icon: <MdDashboard />,
    redirect: "/dashboard",
  },
  {
    title: "Survey",
    icon: <FaPoll />,
    redirect: "/survey",
  },
  {
    title: "Profile",
    icon: <FaRegUserCircle />,
    redirect: "/profile",
  },
];


export { optionsAdmin,optionsEmp};
