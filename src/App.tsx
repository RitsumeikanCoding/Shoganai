import * as React from 'react';
import css from './App.module.css';
import { ParsePDFFile } from '../control/PDFReader';
import { ReadExcelFile } from '../control/ExcelFilter';
import { Course } from '../control/CourseData';
import { TimetableViewer } from '../components/TimetableViewer';
//import { GoogleLogin } from '@react-oauth/google';
import { GoogleCalenderCallTest as GoogleCalenderAuth, GoogleCalenderCallTestEvent as GoogleCalenderSendCourses } from '../API/API';

export const App: React.FC = () => {
    const [quarterTwoActive, setQuarterTwoActive] = React.useState(false);
    const [quarterText, setQuarterText] = React.useState("Q1");
    const [loadedCourses, setLoadedCourses] = React.useState<Course[]>([]);
    const [displayCourses, setDisplayCourses] = React.useState(false);
    const [curriculum, setCurriculum] = React.useState("2017");
    const [fileSelected, setFileSelected] = React.useState<File>();

    React.useEffect(() => {
        if (loadedCourses !== null && loadedCourses.length > 0 && loadedCourses[0].location !== undefined) {
            setDisplayCourses(true);
        }
    }, [loadedCourses])

    const onQuarterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuarterTwoActive(event.target.checked);
        setQuarterText(event.target.checked ? "Q2" : "Q1");
    }


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
                setDisplayCourses(false)
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
            setLoadedCourses(result);
        };
        fileReader.readAsArrayBuffer(data);
    };

    const onLoginGoogle = async () => {
        GoogleCalenderAuth();
    };

    const onTestGoogleCalender = async () => {
        GoogleCalenderSendCourses(loadedCourses, quarterText);
    };

    return (
        <div className={css.container}>
            <div className={css.sidebar}>
                <div className={css.uploadContainer}>
                    <label htmlFor="fileInput" className={css.uploadLabel}>
                        {fileSelected !== undefined ? fileSelected.name : "Upload File"}
                    </label>
                    <input type="file" id="fileInput" accept=".pdf" onChange={handleFileChange} />
                </div>
                <button id={css.generateButton} onClick={onGenerateSchedule}>Make Schedule</button>
                <br />
                <br />
                <br />
                <button id={css.loginToGoogle} onClick={onLoginGoogle}>Login to Google</button>
                <button id={css.importGoogleCalendarButton} onClick={onTestGoogleCalender}>Export Courses</button>
                {/*<GoogleLogin onSuccess={responseMessage} onError={errorMessage} />*/}
            </div>
            <div className={css.main}>
                <div className={css.sliderContainer}>
                    <label className={css.switch}>
                        <input type="checkbox" checked={quarterTwoActive} id="quarterToggle" onChange={onQuarterChange} />
                        <span className={css.slider}></span>
                    </label>
                    <span id={css.quarterLabel}>{quarterText}</span>
                </div>
                <TimetableViewer courses={loadedCourses} displayCourses={displayCourses} quarter={quarterText} />
            </div>
        </div>
    )
};
