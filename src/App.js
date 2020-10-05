import React, { useContext, useState, useEffect, useRef } from "react";
import Schedule from "./schedule";
import styled from "@emotion/styled";
import moment from "moment";

import AppContext from "./app-context";

function Header() {
  const { time } = useContext(AppContext);

  const Wrapper = styled.div`
    height: 6rem;
    line-height: 4rem;
    font-size: 2rem;
    text-align: center;
    width: 100%;
  `;

  let dayIndex = moment(time).day() - 1;
  if (dayIndex === -1) {
    dayIndex = 6;
  }

  const labels = ["man", "tir", "ons", "tor", "fre", "lør", "søn"].map(
    (label, index) => {
      const Day = styled.span`
        display: inline-block;
        color: ${index === dayIndex ? "white" : "#555"};
        font-weight: ${index === dayIndex ? "bold" : "normal"};
        margin-left: 1rem;
        margin-right: 1rem;
      `;

      return <Day key={index}>{label}</Day>;
    }
  );

  return <Wrapper>{labels}</Wrapper>;
}

export default function App() {
  const { claraEvents, charlieEvents, time } = useContext(AppContext);

  const containerElement = useRef();
  const [height, setHeight] = useState(null);

  useEffect(() => {
    setHeight(containerElement.current.getBoundingClientRect().height);
  }, [containerElement]);

  return (
    <>
      <Header time={time} />
      <div ref={containerElement} className="container">
        <div className="column">
          <Schedule name="Clara" events={claraEvents} height={height} />
        </div>
        <div className="column">
          <Schedule name="Charlie" events={charlieEvents} height={height} />
        </div>
      </div>
    </>
  );
}
