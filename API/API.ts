import { Course } from "../control/CourseData";
import { PeriodEndTimes, PeriodStartTimes } from "../control/util";

import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "1030159274106-2eap8atrikm6orr165ip6mi579t3ev23.apps.googleusercontent.com",
  apiKey: "AIzaSyBL7yowDy4t2qeS31EKJBojzx51ldqZuNg", 
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

export const GoogleCalenderCallTest = () => {
    apiCalendar.handleAuthClick();
}

export const GoogleCalenderCallTestEvent = (courses: Course[], quarter: string) => {
    const currentQuarter = quarter === "Q1" ? "1" : "2";
    courses.forEach(course => {
        if (course.day === "0" || course.period === "0" || course.semester !== "0" && course.semester !== currentQuarter) {
            return;
        }

        var current = new Date;
        var first = current.getDate() - current.getDay() + parseInt(course.day);
        var firstday = new Date(current.setDate(first));
        let startPeriod = PeriodStartTimes[parseInt(course.period)];
        let endPeriod = PeriodEndTimes[parseInt(course.period)];
        var lastday = new Date(firstday);
        firstday.setHours(startPeriod.hours, startPeriod.minutes, 0);
        lastday.setHours(endPeriod.hours, endPeriod.minutes, 0);

        apiCalendar.createEvent({
            summary: course.name,
            location: course.location,
            description: `Instructor: ${course.instructor}\nCredits: ${course.credits}\nLanguage: ${course.language}\nCode: ${course.code}`,
            start: {
              dateTime: firstday.toISOString(),
              timeZone: "Asia/Tokyo"
            },
            end: {
              dateTime: lastday.toISOString(),
              timeZone: "Asia/Tokyo"
            },
          }).then((res) => {
            console.log(res);
          })
    });
}
