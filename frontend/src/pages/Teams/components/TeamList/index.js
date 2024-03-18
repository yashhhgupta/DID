import TeamRow from "./TeamRow";
import styles from "./styles.module.css";

const TeamList = ({ teams, employees, deps }) => {
  return (
      <table className={styles.customtable}>
        <tr>
          <th>S.No.</th>
          <th>Team Name</th>
          <th>Department</th>
          <th>Employees</th>
          <th></th>
        </tr>
        <tbody>
          {teams.map((team, index) => {
            const depName = deps.find(
              (dep) => dep.value === team.departmentId
            )?.label;
            return (
              <TeamRow
                team={team}
                index={index}
                depName={depName}
                key={index}
                employees={employees}
                deps={deps}
                teams={teams}
              />
            );
          })}
        </tbody>
      </table>
  );
};
export default TeamList;
