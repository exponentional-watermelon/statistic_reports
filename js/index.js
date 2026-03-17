const canvasContainer = document.querySelector(".canvas-container");
const imagesContainer = document.querySelector(".generated-images");
const generateButton = document.querySelector(".action-button--generate");
const editPanel = document.querySelector(".edit-toolbar");
const downloadAllButton = document.querySelector(".edit-toolbar__button--download-all");
const deleteAllButton = document.querySelector(".edit-toolbar__button--delete-all");
const generationLoader = document.querySelector(".loading-indicator");


downloadAllButton.innerHTML = SVG.DOWNLOAD_BUTTON;
deleteAllButton.innerHTML = SVG.DELETE_BUTTON;



function showGenerationButton() {
    generateButton.classList.remove("display-none");
}


function hideGenerationButton() {
    generateButton.classList.add("display-none");
}


function showEditPanel() {
    editPanel.classList.remove("display-none");
}


function hideEditPanel() {
    editPanel.classList.add("display-none");
}



function getStudentsConfigs(reports) {
    let studentsConfigs = [];

    for (let report of reports) {
        for (let student of report.journal) {
            studentsConfigs.push({
                studentID: student.student_id,
                studentName: student.student_name,
                numStudentLives: student.student_lives_count,
                lessons: student.student_lessons,
                canvasSize: getCanvasSize(student.student_lessons.length)
            });
        }
    }

    return studentsConfigs;
}


async function renderImage(baseConfig, renderConfig, canvasContainer) {
    let config = {...baseConfig, ...renderConfig};

    let canvas = renderCanvas(config);
    canvasContainer.appendChild(canvas);
    let b64 = await canvasToBase64(canvas);
    canvasContainer.removeChild(canvas);

    return b64;
}


async function canvasToBase64(canvas) {
    return await domtoimage.toPng(canvas);
}


async function renderImages(baseConfig, studentsConfigs) {
    let renderedImages = [];

    let loader = new GenerationLoader();
    let numItems = studentsConfigs.length;
    loader.init(numItems);

    for (let i = 0; i < numItems; i++) {
        loader.makeStep();

        let studentName = studentsConfigs[i].studentName ? studentsConfigs[i].studentName : "";
        let fileName = `${studentName} (${studentsConfigs[i].studentID})`.trim();

        let image = await renderImage(baseConfig, studentsConfigs[i], canvasContainer);
        renderedImages.push({
            image: image,
            fileName: fileName
        });
    }

    loader.destroy();

    return renderedImages;
}









generateButton.addEventListener("click", async () => {
    let reports = await getReports();
    if (reports.length == 0) {
        return
    }


    let baseConfig = getBaseConfig();
    if (!baseConfig) {
        return
    }

    hideGenerationButton();
    
    let studentsConfigs = getStudentsConfigs(reports);

    

    let renderedImages = await renderImages(baseConfig, studentsConfigs);

    showEditPanel();


    let buffer = new Buffer();

    downloadAllButton.addEventListener("click", () => {
        let groupName = baseConfig.groupName ? baseConfig.groupName : "";
        buffer.downloadAll(`Группа ${groupName.trim()}.zip`);
    });
    deleteAllButton.addEventListener("click", () => {
        buffer.deleteAll();
        showGenerationButton();
        hideEditPanel();
    });

    for (let i = 0; i < renderedImages.length; i++) {
        let imageCard = new ImageCard(renderedImages[i].image, renderedImages[i].fileName, i+1);
        buffer.addCard(imageCard);
    }
});