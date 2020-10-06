import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import moment from "moment";
import colors from "./colors";
import { overlaps, sortByStart } from "./date-utils";

function Header({ name, avatarUrl, height }) {
  const Wrapper = styled.div`
    // line-height: 5rem;
    height: ${height}px;
    width: 100%;
  `;

  const Avatar = styled.img`
    border-radius: 5rem;
    max-height: 5rem;
    max-width: 5rem;
  `;

  const Text = styled.span`
    font-weight: bold;
    font-size: 2.5rem;
    display: inline-block;
    margin-left: 1rem;
    position: relative;
    top: -1.25rem;
  `;

  return (
    <Wrapper>
      <Avatar src={avatarUrl} alt={name} />
      <Text>{name}</Text>
    </Wrapper>
  );
}

function EventList({ events, hourHeight, start, totalWidth }) {
  const startInMinutes = start * 60;
  const pixelMinuteRatio = hourHeight / 60;

  const shortId = (eventId) => eventId.substr(0, 3);

  const calculatePlacementOf = (event) => {
    const startOfEvent = moment.utc(event.start).local();
    const finishOfEvent = moment.utc(event.end).local();

    const startOfDay = moment(startOfEvent).startOf("day");

    const startOfEventInMinutes = startOfEvent.diff(startOfDay, "minutes");
    const finishOfEventInMinutes = finishOfEvent.diff(startOfDay, "minutes");
    const durationOfEventInMinutes =
      finishOfEventInMinutes - startOfEventInMinutes;

    const top = (startOfEventInMinutes - startInMinutes) * pixelMinuteRatio;
    const height = durationOfEventInMinutes * pixelMinuteRatio;

    return { top, height };
  };

  const items = sortByStart(events || []).map((event) => {
    const { top, height } = calculatePlacementOf(event);

    const overlappingEvents = overlaps(event, events);

    const index = overlappingEvents.findIndex((value) => value.id == event.id);

    const width = (totalWidth - 60) / overlappingEvents.length;
    const left = 20 + index * width;

    const EventContainer = styled.div`
      border: 1px solid black;
      border-radius: 6px;
      position: absolute;
      left: ${left}px;
      top: ${top}px;
      height: ${height}px;
      width: ${width}px;
      color: white;
      background-color: #${colors(event.title)};
    `;

    const Content = styled.div`
      padding: 4px;
      font-family: system-ui, monospace;
    `;

    const TimeLabel = styled.span`
      float: right;
      font-size: 0.75rem;
    `;

    const prettyTime = (time) => moment(time).format("H:mm");

    return (
      <EventContainer key={event.id} data-id={shortId(event.id)}>
        <Content>
          <strong>{event.title}</strong>
          <TimeLabel>{`(${prettyTime(event.start)} - ${prettyTime(
            event.end
          )})`}</TimeLabel>
        </Content>
      </EventContainer>
    );
  });

  return <>{items}</>;
}

function Timeslots({ start, finish, hourHeight }) {
  const lines = new Array();

  const slots = finish - start + 1;

  for (let i = 0; i < slots; i++) {
    const Hr = styled.hr`
      height: 0px;
      border: none;
      border-bottom: 1px dashed white;
      margin: 0;
      padding: 0;
      position: absolute;
      left: 20px;
      right: 0;
      top: ${i * hourHeight}px;
    `;

    const Label = styled.span`
      margin: 0;
      padding: 0;
      position: absolute;
      left: 0px;
      width: 16px;
      top: ${i * hourHeight - 6}px;
      display: inline-block;
      text-align: right;
      font-size: 12px;
      line-height: 12px;
    `;

    lines.push(<Hr key={`Line-${i}`} />);
    lines.push(<Label key={`Label-${i}`}>{start + i}</Label>);
  }

  return <>{lines}</>;
}

export default function Schedule({ name, events, height }) {
  const timeSpan = { start: 8, finish: 16 };
  const [contentWidth, setContentWidth] = useState(null);
  const contentElement = useRef();

  const headerHeight = 115;
  const hourHeight = Math.floor(
    (height - headerHeight) / (timeSpan.finish - timeSpan.start + 1)
  );

  const Wrapper = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `;

  const Content = styled.div`
    position: relative;
    width: 100%;
    flex-grow: 1;
  `;

  useEffect(() => {
    const totalWidth = contentElement.current.getBoundingClientRect().width;
    setContentWidth(totalWidth);
  }, [contentElement]);

  return (
    <Wrapper>
      <Header
        name={name}
        avatarUrl={`/img/${name.toLowerCase()}-avatar.png`}
        height={headerHeight}
      />
      <Content ref={contentElement}>
        <Timeslots
          start={timeSpan.start}
          finish={timeSpan.finish}
          hourHeight={hourHeight}
          totalWidth={contentWidth}
        />
        <EventList
          events={events}
          start={timeSpan.start}
          finish={timeSpan.finish}
          hourHeight={hourHeight}
          totalWidth={contentWidth}
        />
      </Content>
    </Wrapper>
  );
}
