import styles from "./styles.module.css";
const Card = ({ children,style }) => {
    return (
      <div className={styles.box} style={{ ...style }}>
        {children}
      </div>
    );
}
export default Card;