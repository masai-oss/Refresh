import React from "react";
import { useHistory } from "react-router-dom";

import styles from "./Styles/pageNotFound.module.css";
import { Button } from "../../Structure/Results Display/Styles/ResultsPageStyle";

const PageNotFound = ({ errorNum, message, des }) => {
  let history = useHistory();

  const goToHome = () => {
    history.push("quiz_topics");
  };
  return (
    <>
      <div className={styles.main}>
        <div className={styles.notfound}>
          <div className={styles.notfound404}></div>
          <h1>{errorNum}</h1>
          <h2>Oops! {message}</h2>
          <p>{des}</p>
          <Button onClick={goToHome}>Go To Home Page</Button>{" "}
        </div>
      </div>
    </>
  );
};

export { PageNotFound };
