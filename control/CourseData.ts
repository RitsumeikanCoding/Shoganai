export type Course = {
    semester: string;
    day: string;
    period: string;
    code: string;
    name: string;
    language: string;
    instructor: string;
    credits: string; // Is empty "" if isExtraClass is true

    location?: string; // Find from EXCEL by using course code.
    isExtraClass?: boolean; // Is true if course code as already been parsed
}

export enum Langauge {
    English,
    Japanese
}

export const StringToCourse = (courseString: string, language: Langauge, previousCourseCodes: string[]): Course | null => {
    try
    {
        let splits = courseString.trim().split("   ");
        let isExtraClass = previousCourseCodes.includes(splits[3]);
        let languageMatches = splits[5].match(/[EJ]/g);
        let isLanguageClass = languageMatches === null || languageMatches.length === 0;
        let instructorNameIsSplit =
            splits.length >= 9 && !isExtraClass ||
            splits.length >= 8 && isExtraClass ||
            !isExtraClass && isLanguageClass && splits.length >= 8 ||
            isExtraClass && isLanguageClass && splits.length >= 7;

        let count = 0;
        let course: Course = {
            semester: splits[count++],
            day: parseSplit(splits[count++], language),
            period: splits[count++],
            code: splits[count++],
            name: parseSplit(splits[count++], language),
            language: !isLanguageClass
                ? splits[count++]
                : "",
            instructor: !instructorNameIsSplit
                ? parseSplit(splits[count++], language, true)
                : parseSplit((splits[count++] + splits[count++]), language, true),
            credits: !isExtraClass
                ? parseSplit(splits[count++], language)
                : "",
            isExtraClass: isExtraClass,
        }
        return course;
    }
    catch {
        return null;
    }
}

const parseSplit = (text: string, language: Langauge, isInstructor: boolean = false): string => {
    if (language === Langauge.Japanese) {
        if (isInstructor) {
            let matches = text.match(/[A-Za-z]/g);
            return matches === null || matches.length === 0
                ?  text.split(" ").join("")
                : text;
        } else {
            return text.split(" ").join("");
        }
    } else {
        return text;
    }
}