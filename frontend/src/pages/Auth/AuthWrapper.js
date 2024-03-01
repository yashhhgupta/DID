import styles from "./styles.module.css"
const AuthWrapper = ({ children }) => {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.left}></div>
          <div className={styles.right}>
            {children}
          </div>
        </div>
      </div>
    );
}
export default AuthWrapper;