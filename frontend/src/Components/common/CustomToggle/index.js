// CustomToggle.js
import React, { useState } from 'react';
import styles from './styles.module.css'; 

const CustomToggle = ({selected,handleClick}) => {
  

  return (
    <div className={styles['custom-toggle']}> 
      <button
        className={selected === false ? styles['active'] : ''} 
        onClick={() => handleClick(false)}
      >
        ALL
      </button>
      <button
        className={selected === true? styles['active'] : ''} 
        onClick={() => handleClick(true)}
      >
        CURRENT
      </button>
    </div>
  );
};

export default CustomToggle;
