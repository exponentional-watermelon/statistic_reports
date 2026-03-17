function getCanvasSize(lessonsLength) {
    if (lessonsLength <= 8) {return "canvas-s"}
    else if (lessonsLength <= 12) {return "canvas-m"}
    else if (lessonsLength <= 16) {return "canvas-l"}
    else {return "canvas-xl"}
}


function createCanvas(size) {
    const canvas = document.createElement("div");
    canvas.classList.add("canvas", size);

    return canvas;
}


function createBackground(subjectGroup, size, color) {
    const background = document.createElement("div");
    background.classList.add("background");
    background.innerHTML = BACKGROUNDS[subjectGroup][size];

    background.querySelectorAll("path").forEach(element => {
        element.style.stroke = color;
    });

    return background;
}


function createSubjectName(name) {
    const subjectName = document.createElement("div");
    subjectName.classList.add("subject-name");
    subjectName.textContent = name;

    return subjectName;
}


function createCompanyLogo() {
    const companyLogo = document.createElement("div");
    companyLogo.classList.add("company-logo");
    companyLogo.innerHTML = SVG.COMPANY_LOGO;

    return companyLogo;
}


function createMainTitle() {
    const mainTitle = document.createElement("div");
    mainTitle.classList.add("main-title");
    mainTitle.textContent = "ИТОГИ МЕСЯЦА";

    return mainTitle;
}


function createMainTitleUnderline(color) {
    const mainTitleUnderline = document.createElement("div");
    mainTitleUnderline.classList.add("main-title-underline");
    mainTitleUnderline.innerHTML = SVG.MAIN_TITLE_UNDERLINE;
    mainTitleUnderline.style.stroke = color;

    return mainTitleUnderline;
}


function createModuleName(name) {
    const moduleName = document.createElement("div");
    moduleName.classList.add("module-name");
    moduleName.textContent = name;

    return moduleName;
}


function createContentWrapper() {
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("content-wrapper");

    return contentWrapper;
}


function createLivesWrapper(numLives) {
    const livesWrapper = document.createElement("div");
    livesWrapper.classList.add("lives-wrapper");

    const livesText = document.createElement("div");
    livesText.innerHTML = `Жизни: <span>${numLives}</span>`;

    livesWrapper.appendChild(livesText);

    return livesWrapper;

}


function createCardsWrapper() {
    const cardsWrapper = document.createElement("div");
    cardsWrapper.classList.add("cards-wrapper");

    return cardsWrapper;
}


function createLessonCard(
    lessonName, 
    lessonStatus, 
    lessonStatusCode, 
    lessonResult, 
    lessonDeadline
) {
    const lessonCard = document.createElement("div");
    lessonCard.classList.add("lesson-card", lessonStatusCode);

    const lessonNameElement = document.createElement("div");
    lessonNameElement.classList.add("lesson-name");
    lessonNameElement.textContent = lessonName;
    lessonCard.appendChild(lessonNameElement);

    const statusLine = document.createElement("div");
    statusLine.classList.add("lesson-status-line");

    if (lessonStatus !== null) {
        const lessonStatusElement = document.createElement("div");
        lessonStatusElement.classList.add("lesson-status");
        lessonStatusElement.textContent = lessonStatus;
        statusLine.appendChild(lessonStatusElement);
    } else if (lessonDeadline !== null) {
            const lessonStatusElement = document.createElement("div");
            lessonStatusElement.classList.add("lesson-status");
            lessonStatusElement.textContent = `Дедлайн: ${lessonDeadline}`;
            statusLine.appendChild(lessonStatusElement);
    }

    if (lessonResult !== null) {
        const lessonResultElement = document.createElement("div");
        lessonResultElement.classList.add("lesson-status");
        lessonResultElement.textContent = lessonResult > 0 ? `${lessonResult}%` : "На проверке";
        statusLine.appendChild(lessonResultElement);
    }

    lessonCard.appendChild(statusLine);

    return lessonCard;
}


function createPersonsWrapper(studentName, curatorName) {
    const personsWrapper = document.createElement("div");
    personsWrapper.classList.add("persons-wrapper");
    
    const studentNameElement = document.createElement("div");
    studentNameElement.textContent = studentName ? studentName : "";
    personsWrapper.appendChild(studentNameElement);

    const curatorameElement = document.createElement("div");
    curatorameElement.textContent = curatorName ? `Куратор: ${curatorName}` : "";
    personsWrapper.appendChild(curatorameElement);

    return personsWrapper;
}


function renderCanvas({
    canvasSize,
    subjectName,
    subjectGroup,
    moduleName,
    primaryColor,
    secondaryColor,
    studentName,
    numStudentLives,
    lessons,
    curatorName
}) {
    const canvas = createCanvas(canvasSize);
    const background = createBackground(subjectGroup, canvasSize, secondaryColor);
    const subjectNameWrapper = createSubjectName(subjectName);
    const companyLogo = createCompanyLogo();
    const mainTitle = createMainTitle();
    const mainTitleUnderline = createMainTitleUnderline(primaryColor);
    const moduleNameWrapper = createModuleName(moduleName);
    const contentWrapper = createContentWrapper();
    const livesWrapper = createLivesWrapper(numStudentLives);
    const cardsWrapper = createCardsWrapper();
    const personsWrapper = createPersonsWrapper(studentName, curatorName);

    lessons.forEach(lesson => {
        const card = createLessonCard(...Object.values(lesson));
        cardsWrapper.appendChild(card);
    });

    canvas.appendChild(background);
    canvas.appendChild(subjectNameWrapper);
    canvas.appendChild(companyLogo);
    canvas.appendChild(mainTitle);
    canvas.appendChild(mainTitleUnderline);
    canvas.appendChild(moduleNameWrapper);
    canvas.appendChild(contentWrapper);
    contentWrapper.appendChild(livesWrapper);
    contentWrapper.appendChild(cardsWrapper);
    contentWrapper.appendChild(personsWrapper);

    return canvas;
}