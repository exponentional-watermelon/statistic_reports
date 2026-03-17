function imageCardUI(image, fileName, cardIndexValue) {
    const card = document.createElement("div");
    card.classList.add("image-card");

    const previewLabel = document.createElement("div");
    previewLabel.classList.add("image-card__label");
    previewLabel.textContent = "Предпросмотр";
    card.appendChild(previewLabel);

    const cardImageWrapper = document.createElement("div");
    cardImageWrapper.classList.add("image-card__image-wrapper");
    card.appendChild(cardImageWrapper);

    const cardImage = document.createElement("img");
    cardImage.src = image;
    cardImage.alt = fileName;
    cardImageWrapper.appendChild(cardImage);

    const fileNameLabel = document.createElement("div");
    fileNameLabel.classList.add("image-card__label");
    fileNameLabel.textContent = "Название файла";
    card.appendChild(fileNameLabel);

    const editLine = document.createElement("div");
    editLine.classList.add("image-card__edit-line");
    card.appendChild(editLine);

    const fileNameInput = document.createElement("input");
    fileNameInput.setAttribute("type", "text");
    fileNameInput.setAttribute("name", "filename");
    fileNameInput.classList.add("image-card__filename-input");
    fileNameInput.value = fileName;
    editLine.appendChild(fileNameInput);

    const downloadButton = document.createElement("div");
    downloadButton.setAttribute("title", "Скачать");
    downloadButton.classList.add("image-card__button", "image-card__button--download");
    downloadButton.innerHTML = SVG.DOWNLOAD_BUTTON;
    editLine.appendChild(downloadButton);

    const deleteButton = document.createElement("div");
    deleteButton.setAttribute("title", "Удалить");
    deleteButton.classList.add("image-card__button", "image-card__button--delete");
    deleteButton.innerHTML = SVG.DELETE_BUTTON;
    editLine.appendChild(deleteButton);

    const cardIndex = document.createElement("div");
    cardIndex.classList.add("image-card__index");
    cardIndex.innerHTML = `<span>#${cardIndexValue}</span>`;
    editLine.appendChild(cardIndex);


    const ui = {
        card: card,
        imageWrapper: cardImageWrapper,
        input: fileNameInput,
        downloadButton: downloadButton,
        deleteButton: deleteButton,
        cardIndex: cardIndex
    }

    return ui;
}


class ImageCard {
    constructor(image, fileName, cardIndex) {
        this.image = image;
        this.fileName = fileName;
        this.firstFileName = `${fileName}`;
        this.ui = imageCardUI(image, fileName, cardIndex);
        this.cardIndex = cardIndex;
    }

    addEvents(buffer) {
        this.ui.imageWrapper.addEventListener("click", () => {showImageModal(this.image, this.fileName)});
        this.ui.input.addEventListener("input", () => {this.changeFileName()});
        this.ui.downloadButton.addEventListener("click", () => {this.downloadFile()});
        this.ui.deleteButton.addEventListener("click", () => {buffer.deleteCard(this)});
    }

    changeFileName() {
        let inputValue = this.ui.input.value;
        if (inputValue) {
            this.fileName = inputValue;
        } else {
            this.ui.input.value = this.fileName;
        }
    }

    downloadFile() {
        let link = document.createElement("a");
        link.href = this.image;
        link.download = `${sanitizeFileName(this.fileName)}.png`;
        link.click();
    }

    renumber(cardIndexValue) {
        this.ui.cardIndex.innerHTML = `<span>#${cardIndexValue}</span>`;
    }
}


class Buffer {
    constructor() {
        this.buffer = [];
        this.ui = document.querySelector(".generated-images");
    }

    addCard(card) {
        this.buffer.push(card);
        this.ui.appendChild(card.ui.card)
        card.addEvents(this);
    }

    deleteCard(card) {
        this.buffer = this.buffer.filter(item => item != card);
        this.ui.removeChild(card.ui.card);
        this.renumberCards();
    }

    renumberCards() {
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i].renumber(i+1);
        }
    }

    downloadAll(archiveName) {
        if (this.buffer.length > 0) {
            const zip = new JSZip();
            for (let card of this.buffer) {
                zip.file(
                    `${sanitizeFileName(card.fileName)}.png`, 
                    card.image.replace("data:image/png;base64,", ""), 
                    {base64: true}
                );
            }
            zip.generateAsync({type:"blob"})
            .then(function(zipBlob) {
                let link = document.createElement("a");
                link.href = URL.createObjectURL(zipBlob);
                link.download = archiveName;
                link.click();
            });
        }
    }

    deleteAll() {
        for (let card of this.buffer) {
            this.deleteCard(card);
        }
    }
}