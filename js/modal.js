function showImageModal(image, name) {
    const modalBackground = document.createElement("div");
    modalBackground.classList.add("image-modal");

    const modalPanel = document.createElement("div");
    modalPanel.classList.add("image-modal__panel");
    modalBackground.appendChild(modalPanel);

    const modalImage = document.createElement("img");
    modalImage.classList.add("image-modal__image");
    modalImage.src = image;
    modalPanel.appendChild(modalImage);

    const exitButton = document.createElement("div");
    exitButton.classList.add("image-modal__exit-button");
    exitButton.innerHTML = SVG.EXIT_BUTTON;
    modalPanel.appendChild(exitButton);

    const imageName = document.createElement("div");
    imageName.classList.add("image-modal__name");
    imageName.textContent = `${name}.png`;
    modalPanel.appendChild(imageName);

    document.body.appendChild(modalBackground);

    exitButton.addEventListener("click", () => {
        document.body.removeChild(modalBackground);
    });
}