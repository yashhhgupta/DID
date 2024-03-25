import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const TableFooter = ({ range, setPage, page, slice }) => {
  const [showNext, setShowNext] = useState(false);
  const [showPrev, setShowPrev] = useState(false);

  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
    setShowNext(page < range.length);
    setShowPrev(page > 1);
  }, [slice, page, setPage, range.length]);

  return (
    <div className={styles.tableFooter}>
      <button
        className={`${styles.button} ${styles.nextButton}`}
        onClick={() => setPage(page - 1)}
        disabled={!showPrev}
      >
        Previous
      </button>
      {range.slice(page - 1, page + 10).map((el, index) => (
        <button
          key={index}
          className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setPage(el);
          }}
        >
          {el}
        </button>
      ))}
      <button
        className={`${styles.button} ${styles.nextButton}`}
        onClick={() => setPage(page + 1)}
        disabled={!showNext}
      >
        Next
      </button>
    </div>
  );
};

export default TableFooter;
