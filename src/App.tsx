import * as React from 'react';
import css from './App.module.css';
import { ParsePDFFile } from '../control/PDFReader';
import { ReadExcelFile } from '../control/ExcelFilter';
import { Course } from '../control/CourseData';

export const App: React.FC = () => {
    const [quarterTwoActive, setQuarterTwoActive] = React.useState(false);
    const [quarterText, setQuarterText] = React.useState("Q1");
    const [loadedCourses, setLoadedCourses] = React.useState<Course[]>([])

    const onQuarterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuarterTwoActive(event.target.checked);
        setQuarterText(event.target.checked ? "Q2" : "Q1");
    }

    const [fileSelected, setFileSelected] = React.useState<File>();

    const handleFileChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList) return;

        setFileSelected(fileList[0]);
        const fileReader = new FileReader();
        fileReader.onload = function (e: Event) {
            var typedarray = fileReader.result as ArrayBuffer;

            const result = ParsePDFFile(typedarray);
            result.then((res) => {
                setLoadedCourses(res.courses);
            })
        }
        fileReader.readAsArrayBuffer(fileList[0]);
    };

    const onGenerateSchedule = async () => {
        let response = await fetch("https://ritsumeikancoding.github.io/Shoganai/resources/2017APM_Curriculum_24Spring_240529.xlsx");
        let data = await response.blob();

        const fileReader = new FileReader();
        fileReader.onload = function (e: Event) {
            var typedarray = fileReader.result as ArrayBuffer;

            const result = ReadExcelFile(loadedCourses, typedarray);
            console.log("Courses: ", result);
        };
        fileReader.readAsArrayBuffer(data);
    };

    return (
        <div className={css.container}>
            <div className={css.sidebar}>
                <div className={css.uploadContainer}>
                    <label htmlFor="fileInput" className={css.uploadLabel}>
                        Upload File
                    </label>
                    <input type="file" id="fileInput" accept=".pdf" onChange={handleFileChange} />
                </div>
                <button id={css.generateButton} onClick={onGenerateSchedule}>Generate Schedule</button>
                <button id={css.importGoogleCalendarButton}>Import to Google Calendar</button>
            </div>
            <div className={css.main}>
                <div className={css.sliderContainer}>
                    <label className={css.switch}>
                        <input type="checkbox" checked={quarterTwoActive} id="quarterToggle" onChange={onQuarterChange} />
                        <span className={css.slider}></span>
                    </label>
                    <span id={css.quarterLabel}>{quarterText}</span>
                </div>
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
                        <tbody>
                            <tr>
                                <td>1st Period</td>
                                <td id="Mon1"></td>
                                <td id="Tue1"></td>
                                <td id="Wed1"></td>
                                <td id="Thu1"></td>
                                <td id="Fri1"></td>
                            </tr>
                            <tr>
                                <td>2nd Period</td>
                                <td id="Mon2"></td>
                                <td id="Tue2"></td>
                                <td id="Wed2"></td>
                                <td id="Thu2"></td>
                                <td id="Fri2"></td>
                            </tr>
                            <tr>
                                <td>3rd Period</td>
                                <td id="Mon3"></td>
                                <td id="Tue3"></td>
                                <td id="Wed3"></td>
                                <td id="Thu3"></td>
                                <td id="Fri3"></td>
                            </tr>
                            <tr>
                                <td>4th Period</td>
                                <td id="Mon4"></td>
                                <td id="Tue4"></td>
                                <td id="Wed4"></td>
                                <td id="Thu4"></td>
                                <td id="Fri4"></td>
                            </tr>
                            <tr>
                                <td>5th Period</td>
                                <td id="Mon5"></td>
                                <td id="Tue5"></td>
                                <td id="Wed5"></td>
                                <td id="Thu5"></td>
                                <td id="Fri5"></td>
                            </tr>
                            <tr>
                                <td>6th Period</td>
                                <td id="Mon6"></td>
                                <td id="Tue6"></td>
                                <td id="Wed6"></td>
                                <td id="Thu6"></td>
                                <td id="Fri6"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};
