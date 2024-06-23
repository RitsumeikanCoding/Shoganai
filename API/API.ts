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
        const { name, period, dayOfWeek } = course;  // Assuming course has these properties
        const startTime = PeriodStartTimes[period];
        const endTime = PeriodEndTimes[period];

        if (!startTime || !endTime) {
            console.error(`Start or end time not found for period: ${period}`);
            return;
        }

        let date = new Date();
        // Set the date to the correct day of the week
        date.setDate(date.getDate() + (dayOfWeek - date.getDay() + 7) % 7);

        // Set the start time
        const [startHour, startMinute] = startTime.split(':').map(Number);
        date.setHours(startHour);
        date.setMinutes(startMinute);

        let endDate = new Date(date);
        // Set the end time
        const [endHour, endMinute] = endTime.split(':').map(Number);
        endDate.setHours(endHour);
        endDate.setMinutes(endMinute);

        // Create the event
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
            console.log(`Event created for course: ${name}`, res);
        }).catch((err) => {
            console.error(`Error creating event for course: ${name}`, err);
        });
    });
}
