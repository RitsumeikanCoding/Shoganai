import { Course, assignPeriodTimes } from "../control/CourseData";

import ApiCalendar from "react-google-calendar-api";

const config = {
  clientId: "471593386803-13j17e9mu4m9c7u1btio0sasrfl8ls54.apps.googleusercontent.com",
  apiKey: "AIzaSyDYdlzf3d18IM7SSLlOTFsVut4pdCUzmLw", 
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

// Function to get the next date for a specific day of the week
const getNextDateForDay = (day: string): Date => {
  const daysOfWeek = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
  };

  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const targetDayOfWeek = daysOfWeek[day];
  
  let daysUntilNext = targetDayOfWeek - todayDayOfWeek;
  if (daysUntilNext < 0) daysUntilNext += 5;

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);
  return nextDate;
};

const createEvents = (courses: Course[]) => {
  courses.forEach(course => {
      const updatedCourse = assignPeriodTimes(course);

      if (updatedCourse.periodStartTime && updatedCourse.periodEndTime) {
          const nextDate = getNextDateForDay(updatedCourse.day);
          const [startHour, startMinute] = updatedCourse.periodStartTime.split(':').map(Number);
          const [endHour, endMinute] = updatedCourse.periodEndTime.split(':').map(Number);

          const startDateTime = new Date(nextDate);
          startDateTime.setHours(startHour, startMinute);

          const endDateTime = new Date(nextDate);
          endDateTime.setHours(endHour, endMinute);

          apiCalendar.createEvent({
              summary: updatedCourse.name,
              location: updatedCourse.location,
              start: {
                  dateTime: startDateTime.toISOString(),
                  timeZone: "Asia/Tokyo",
              },
              end: {
                  dateTime: endDateTime.toISOString(),
                  timeZone: "Asia/Tokyo",
              },
          }).then((res: any) => {
              console.log(`Event created for ${updatedCourse.name}: `, res);
          }).catch((err: any) => {
              console.error(`Error creating event for ${updatedCourse.name}: `, err);
          });
      } else {
          console.error(`Start or End time is missing for period: ${updatedCourse.period}`);
      }
  });
};

// Example usage:
const courses: Course[] = [];

createEvents(courses);
