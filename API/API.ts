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
    let date = new Date();
    date = new Date(date.getFullYear(),date.getMonth(), date.getDate())
    date.setHours(8);
    date.setMinutes(45);

    let endDate = new Date(date);
    endDate.setHours(10);

    // Need to manually edit function
    //https://developers.google.com/calendar/api/v3/reference/events
    apiCalendar.createEvent({
        summary: "New test",
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
      })
}
