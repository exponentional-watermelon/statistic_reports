function sanitizeFileName(name) {
    let sanitized = name.replace(/[\\/:*?"<>|\x00-\x1F\x7F]/g, "_");
    sanitized = sanitized.replace(/^\.+/, "").replace(/\.+$/, "");
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/\.{2,}/g, ".");
    sanitized = sanitized.replace(/_{2,}/g, "_");

    if (!sanitized || sanitized.length === 0) {
        return "";
    }
    
    if (sanitized.length > 255) {
        const ext = sanitized.includes(".") ? sanitized.split(".").pop() : "";
        const nameWithoutExt = ext ? sanitized.slice(0, -(ext.length + 1)) : sanitized;
        
        if (ext) {
            sanitized = nameWithoutExt.slice(0, 255 - ext.length - 1) + "." + ext;
        } else {
            sanitized = sanitized.slice(0, 255);
        }
    }
    
    return sanitized;
}


function validateFile(file) {
    if ((file === null) || (file === undefined) || (typeof file !== "object")) {
        return {isValid: false}
    }
    
    const fields = {
        main: [
            {
                name: "subject_name",
                validator: (value) => {return (typeof value === "string")}
            },
            {
                name: "course_name",
                validator: (value) => {return (typeof value === "string")}
            },
            {
                name: "module_name",
                validator: (value) => {return (typeof value === "string")}
            },
            {
                name: "curator_name",
                validator: (value) => {return (typeof value === "string" || value === null)}
            },
            {
                name: "journal",
                validator: (value) => {return (Array.isArray(value) && validateLength(value))}
            }
        ],
        journal: [
            {
                name: "student_id",
                validator: (value) => {return (typeof value === "number")}
            },
            {
                name: "student_name",
                validator: (value) => {return (typeof value === "string" || value === null)}
            },
            {
                name: "student_lives_count",
                validator: (value) => {return (typeof value === "number")}
            },
            {
                name: "student_lessons",
                validator: (value) => {return (Array.isArray(value) && validateLength(value))}
            }
        ],
        lessons: [
            {
                name: "lesson_name",
                validator: (value) => {return (typeof value === "string")}
            },
            {
                name: "lesson_status",
                validator: (value) => {return (typeof value === "string" || value === null)}
            },
            {
                name: "lesson_status_code",
                validator: (value) => {return (typeof value === "string")}
            },
            {
                name: "lesson_result",
                validator: (value) => {return (typeof value === "number" || value === null)}
            },
            {
                name: "lesson_deadline",
                validator: (value) => {return (typeof value === "string" || value === null)}
            }
        ]
    }

    for (let item of fields.main) {
        if (!(item.name in file)) {
            return {
                isValid: false,
                message: `В отчете нет поля "${item.name}"`
            }
        } else if (!item.validator(file[item.name])) {
            return {
                isValid: false,
                message: `Поле "${item.name}" содержит некорректные данные`
            }
        }
    }

    for (let journalItem of file.journal) {
        for (let item of fields.journal) {
            if (!(item.name in journalItem)) {
                return {
                    isValid: false,
                    message: `В отчете нет поля "${item.name}"`
                }
            } else if (!item.validator(journalItem[item.name])) {
                return {
                    isValid: false,
                    message: `Поле "${item.name}" содержит некорректные данные`
                }
            }
        }
    }

    for (let journalItem of file.journal) {
        for (let lessonItem of journalItem.student_lessons) {
            for (let item of fields.lessons) {
                if (!(item.name in lessonItem)) {
                    return {
                        isValid: false,
                        message: `В отчете нет поля "${item.name}"`
                    }
                } else if (!item.validator(lessonItem[item.name])) {
                    return {
                        isValid: false,
                        message: `В отчете нет поля "${item.name}"`
                    }
                }
            }
        }
    }

    return {isValid: true}
}


function validateLength(array) {
    if (!Array.isArray(array)) {
        return false
    } else if (array.length > 0) {
        return true
    } else {
        return false
    }
}