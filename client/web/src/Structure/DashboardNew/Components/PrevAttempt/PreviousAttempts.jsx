import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AttemptHeadingCard from "./AttemptHeading";
import "../../Styles/PreviousAttemptCard.css";
import SingleAttemptComponent from "../../../Results Display/Components/attempts/SingleAttemptComponent";
import { resultAction } from "../../../Results Display/index";
const PreviousAttempts = (props) => {
  const prev_attempt_id = useSelector(
    (state) => state.resultReducer.prev_attempt_result
  );
  let dispatch = useDispatch();
  const clickHandler = (id) => {
    dispatch(
      resultAction.getResult({ attempt_id: id, topicId: props.topicID })
    );
  };
  let data = props.prev_attempts;
  data = data.reverse();
  // window.onload = function () {
  //   if (
  //     !window.location.hash &&
  //     data.length == 1 &&
  //     data[0].correct == 0 &&
  //     data[0].incorrect == 0 &&
  //     data[0].skipped == 0
  //   ) {
  //     window.location = window.location + "#loaded";
  //     window.location.reload();
  //   }
  // };
  // console.log("Data: --------------", data);
  // if (
  //   data.length == 1 &&
  //   data[0].correct == 0 &&
  //   data[0].incorrect == 0 &&
  //   data[0].skipped == 0
  // ) {
  //   window.location.reload();
  // }
  return (
    <div>
      <AttemptHeadingCard />
      <div className="prev-attempt--Card">
        {data.map((ele, index) =>
          index !== data.length - 1 ? (
            <div key={index}>
              <SingleAttemptComponent
                ele={ele}
                select={prev_attempt_id}
                onClickDiv={clickHandler}
                key={ele.attempt_id}
              />
              <hr
                style={{
                  border: "1px solid #E5E5E5",
                  backgroundColor: "#E5E5E5",
                  margin: "0px",
                }}
              />
            </div>
          ) : (
            <div key={index}>
              <SingleAttemptComponent
                ele={ele}
                select={prev_attempt_id}
                onClickDiv={clickHandler}
                key={ele.attempt_id}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export { PreviousAttempts };
