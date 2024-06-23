import * as React from 'react';
import css from './TimetableViewer.module.css';
import { Course } from '../control/CourseData';

type Props = {
    courses: Course[],
    displayCourses: boolean
    quarter: string;
}

export const TimetableViewer: React.FC<Props> = ({courses, displayCourses, quarter}) => {
    const makeTableBody = () => {
        const makeRow = (number: number, courses: Course[]) => {
            const text = number === 7 ? "Session" : "Period " + number;

            return (
            <tr key={number}>
                <td>{text}</td>
                { displayCourses ? <>
                    <ClassBox course={courses.find((course) => course.day === "1")} />
                    <ClassBox course={courses.find((course) => course.day === "2")} />
                    <ClassBox course={courses.find((course) => course.day === "3")} />
                    <ClassBox course={courses.find((course) => course.day === "4")} />
                    <ClassBox course={courses.find((course) => course.day === "5")} />
                </>:
                <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </>}
            </tr>);
        }
       
        const makeRows = () => {
            const outputRows: React.JSX.Element[] = [];
            for (let index = 1; index <= 7; index++) {
                const periodCourses = index === 7 ? courses.filter((course) => course.period == "Session") : courses.filter((course) => course.period == index.toString());
                outputRows.push(makeRow(index, periodCourses));
            }
            return outputRows;
        }

        return (<tbody>
            {makeRows()}
        </tbody>)
    }

    return (
        <div id={css.calendarContainer}>
            <table id={css.calendarTable}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                </thead>
                {makeTableBody()}
            </table>
        </div>
    )
}

type PropsClassBox = {
    course?: Course,
}

export const ClassBox: React.FC<PropsClassBox> = ({course}) => {
    return (
        <td className={css.cellBox}>
            {course?.name}
            <br />
            {course?.location}
        </td>
    );
};