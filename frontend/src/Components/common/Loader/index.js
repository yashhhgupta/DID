import LoaderGIF from "../../../assets/loader1.gif";
import Modal from "../Modal";
import styles from "./styles.module.css";

const Loader = ({isLoading}) => {
    return (
      <Modal isOpen={isLoading}>
        <div className={styles.container}>
          <img src={LoaderGIF} alt="Loading..." />
        </div>
      </Modal>
    );
}
export default Loader;