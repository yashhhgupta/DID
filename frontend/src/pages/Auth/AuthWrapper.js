import styles from "./styles.module.css";
import Bar from "../../assets/bar.png";
import { Card } from "../../Components/common";
import Pie from "../../assets/pie.png";
import Score from "../../assets/score.png";

const AuthWrapper = ({ children }) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.images}>
            <div className={styles.img2}>
              <Card>
                <img src={Bar} alt="bar" height={200} />
              </Card>
              <div className={styles.img1}>
                <Card style={{ padding: "1rem 3rem" }}>
                  <img src={Pie} alt="pie" height={90} />
                </Card>
              </div>
              <div className={styles.img3}>
                <Card style={{ padding: "1rem 3rem" }}>
                  <img src={Score} alt="pie" height={90} />
                </Card>
              </div>
            </div>
          </div>
          <div className={styles.heading}>
            <span className={styles.head1}>Empowering Unity</span>
            <br />
            <span className={styles.head2}>Celebrating Diversity</span>
            <br />
            Inclusion's the spark, our shared affinity
          </div>
        </div>
        <div className={styles.right}>{children}</div>
      </div>
    </div>
  );
};
export default AuthWrapper;
