function generationLoaderUI() {
    const loader = document.querySelector(".loading-indicator");

    const loaderWrapper = document.createElement("div");
    loaderWrapper.classList.add("loading-indicator__wrapper");

    const loaderText = document.createElement("div");
    loaderText.classList.add("loading-indicator__text");
    loaderText.textContent = "Идет генерация...";
    loaderWrapper.appendChild(loaderText);

    const loaderStatus = document.createElement("div");
    loaderStatus.classList.add("loading-indicator__status");
    loaderWrapper.appendChild(loaderStatus);

    const statusText = document.createElement("div");
    statusText.classList.add("loading-indicator__status-text");
    loaderStatus.appendChild(statusText);

    const progressBarWrapper = document.createElement("div");
    progressBarWrapper.classList.add("loading-indicator__bar-wrapper");
    loaderStatus.appendChild(progressBarWrapper);

    const progressBar = document.createElement("div");
    progressBar.classList.add("loading-indicator__bar");
    progressBarWrapper.appendChild(progressBar);


    const ui = {
        loader: loader,
        wrapper: loaderWrapper,
        text: statusText,
        bar: progressBar
    }

    return ui;
}


class GenerationLoader {
    init(numSteps) {
        this.numSteps = numSteps;
        this.currentStep = 0;
        this.ui = generationLoaderUI();
        
        this.ui.loader.appendChild(this.ui.wrapper);
        this.ui.text.textContent =  `${this.currentStep}/${this.numSteps}`;
    }

    makeStep() {
        this.currentStep++;

        let width = this.currentStep / this.numSteps * 100;
        this.ui.bar.style.width = `${width}%`;
        this.ui.text.textContent = `${this.currentStep}/${this.numSteps}`;
    }

    destroy() {
        this.ui.loader.removeChild(this.ui.wrapper);
    }
}