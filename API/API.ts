import { Course } from "../control/CourseData";
import { PeriodEndTimes, PeriodStartTimes } from "../control/util";

import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "913547426535-069h7s0rve3ug1g46n1dn3477agasfbb.apps.googleusercontent.com",
  apiKey: "AIzaSyCWN_bevAT42a9GjwM5QcTLaTzV3FmWjLs", 
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

export const GoogleCalenderCallTest = () => {
  apiCalendar.handleAuthClick();
}

export const GoogleCalenderCallTestEvent = (courses: Course[]) => {
  courses.forEach(course => {
    const { day, period, name } = course;
    
    let date = new Date();
    date.setDate(date.getDate() + ((7 + day - date.getDay()) % 7)); // Set to the next course day
    date.setHours(parseInt(PeriodStartTimes[period].split(":")[0]));
    date.setMinutes(parseInt(PeriodStartTimes[period].split(":")[1]));

    let endDate = new Date(date);
    endDate.setHours(parseInt(PeriodEndTimes[period].split(":")[0]));
    endDate.setMinutes(parseInt(PeriodEndTimes[period].split(":")[1]));

    // Create event
    apiCalendar.createEvent({
      summary: name,
      start: {
        dateTime: date.toISOString(),
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Asia/Tokyo",
      },
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  });
}
