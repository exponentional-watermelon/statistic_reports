Dropzone.autoDiscover = false;

const dropzoneField = document.querySelector("#files-dropzone");


const dropzone = new Dropzone("#files-dropzone", {
    url: "#",
    autoProcessQueue: false,
    addRemoveLinks: false,
    previewTemplate: '<div style="display:none"></div>',
    parallelUploads: 1,
    
    init: function() {
        this.processQueue = function() { return false; };
        this.enqueueFile = function() { return false; };
        
        this.on("addedfile", function(file) {
            
            file.status = Dropzone.SUCCESS;
            file.accepted = true;
            file.processing = false;
            
            this.emit("success", file);
            this.emit("complete", file);
            
        }.bind(this));
        
        this.on("complete", function(file) {
            updateFileList();
        }.bind(this));
        
        this.on("success", function(file) {
            console.log(`Добавлено: ${file.name}`);
        }.bind(this));
    }
});


function fileUI(fileName) {
    const file = document.createElement("div");
    file.classList.add("input-file");

    const preview = document.createElement("div");
    preview.classList.add("input-file__preview");
    preview.innerHTML = SVG.JSON_PREVIEW;
    file.appendChild(preview);

    const wrapper = document.createElement("div");
    wrapper.classList.add("input-file__wrapper");
    file.appendChild(wrapper);

    const name = document.createElement("div");
    name.classList.add("input-file__name");
    name.textContent = fileName;
    wrapper.appendChild(name);

    const button = document.createElement("div");
    button.classList.add("input-file__delete-button");
    button.textContent = "Удалить";
    wrapper.appendChild(button);

    return {
        file: file,
        button: button
    }
}


function updateFileList() {
    if (!dropzoneField.classList.contains("non-empty")) {
        dropzoneField.classList.add("non-empty");
    }

    let files = dropzone.files;
    for (let file of files) {
        if (!file.name.toLowerCase().endsWith(".json")) {
            dropzone.removeFile(file);
            if (dropzone.files.length == 0) {
                dropzoneField.classList.remove("non-empty");
            }
            alert("Можно добавить только .json файлы");
            return
        }

        const isRendered = file.isRendered;
        if (!isRendered) {
            file.ui = fileUI(file.name);
            dropzoneField.appendChild(file.ui.file);
            file.ui.button.addEventListener("click", () => {
                dropzoneField.removeChild(file.ui.file);
                dropzone.removeFile(file);

                if (dropzone.files.length == 0) {
                    dropzoneField.classList.remove("non-empty");
                }
            });
            file.isRendered = true;
        }
    }
}


async function getReports() {
    console.log(dropzone.files);

    const files = await processFiles(dropzone);

    const reports = [];
    
    for (let file of files) {
        const validationStatus = validateFile(file.content);
        if (validationStatus.isValid) {
            reports.push(file.content);
        } else {
            alert(`Файл ${file.name} не прошел валидацию!\nСообщение: ${validationStatus.message}`)
        }
    }

    return reports;
}


function parseDropzoneFiles(files) {
    return files.map(file => {
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                try {
                    const jsonContent = JSON.parse(e.target.result);
                    
                    resolve({
                        name: file.name,
                        size: file.size,
                        lastModified: file.lastModified,
                        content: jsonContent,
                    });
                } catch (error) {
                    reject(new Error(`Ошибка парсинга JSON в файле ${file.name}: ${error.message}`));
                }
            };
            
            reader.onerror = () => {
                reject(new Error(`Ошибка чтения файла ${file.name}`));
            };
            
            reader.readAsText(file);
        });
    });
}


async function processFiles(dropzone) {
    try {
        const successFiles = dropzone.files.filter(f => f.status === Dropzone.SUCCESS);
        const parsedFiles = await Promise.all(parseDropzoneFiles(successFiles));
        return parsedFiles;
        
    } catch (error) {
        console.error('Ошибка при парсинге файлов:', error);
        return [];
    }
}