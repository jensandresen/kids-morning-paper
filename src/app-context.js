import React, { createContext, useEffect, useState } from "react";
import moment from "moment";

const appContext = createContext(null);

function transformEvents(events) {
  return events.map((e) => {
    return {
      ...e,
      ...{ start: new Date(e.start), end: new Date(e.end) },
    };
  });
}

function AppContextProvider({ children }) {
  const [claraEvents, setClaraEvents] = useState([]);
  const [charlieEvents, setCharlieEvents] = useState([]);
  const [time, setTime] = useState(new Date("2000-01-01"));
  const [lastUpdated, setLastUpdated] = useState(new Date("2000-01-01"));

  useEffect(() => {
    setTime(new Date());
    // const handle = setInterval(() => setTime(new Date()), 1000);
    // return () => clearInterval(handle);
  }, []);

  useEffect(() => {
    const duration = moment(time).diff(lastUpdated, "seconds");
    if (duration >= 30) {
      setLastUpdated(time);

      const dateAsString = moment(time).format("YYYY-MM-DD");

      fetch(`api/schedules/clara/${dateAsString}`)
        .then((response) => response.json())
        .then((data) => data.events || [])
        .then(transformEvents)
        .then((events) => setClaraEvents(events));

      fetch(`api/schedules/charlie/${dateAsString}`)
        .then((response) => response.json())
        .then((data) => data.events || [])
        .then(transformEvents)
        .then((events) => setCharlieEvents(events));
    }
  }, [time]);

  const aggregatedState = {
    claraEvents,
    charlieEvents,
    time,
  };

  return (
    <appContext.Provider value={aggregatedState}>
      {children}
    </appContext.Provider>
  );
}

export { appContext as default, AppContextProvider };
