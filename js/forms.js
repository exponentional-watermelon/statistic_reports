const subjectNameSelect = document.querySelector("#subject-name-select");
const subjectGroupSelect = document.querySelector("#subject-group-select");

const moduleNameInput = document.querySelector("#module-name-input");
const moduleNameError = document.querySelector("#module-name-error");

const curatorNameInput = document.querySelector("#curator-name-input");

const groupNameInput = document.querySelector("#group-name-input");
const groupNameError = document.querySelector("#group-name-error");


for (let item of SUBJECTS) {
    const option = document.createElement("option");
    option.value = "";
    option.dataset.primaryColor = item["primary_color"];
    option.dataset.secondaryColor = item["secondary_color"];
    option.textContent = item["name"];
    subjectNameSelect.appendChild(option);
}


for (let item of SUBJECT_GROUPS) {
    const option = document.createElement("option");
    option.value = item.alias;
    option.textContent = item.name;
    subjectGroupSelect.appendChild(option);
}


moduleNameInput.addEventListener("input", () => {
    if (!moduleNameError.classList.contains("display-none")) {
        if (moduleNameInput.value) {
            moduleNameInput.classList.remove("input-error");
            moduleNameError.classList.add("display-none");
        }
    } else {
        if (!moduleNameInput.value) {
            moduleNameInput.classList.add("input-error");
            moduleNameError.classList.remove("display-none");
        }
    }
});

groupNameInput.addEventListener("input", () => {
    if (!groupNameError.classList.contains("display-none")) {
        if (groupNameInput.value) {
            groupNameInput.classList.remove("input-error");
            groupNameError.classList.add("display-none");
        }
    } else {
        if (!groupNameInput.value) {
            groupNameInput.classList.add("input-error");
            groupNameError.classList.remove("display-none");
        }
    }
});


function getBaseConfig() {
    const selectedSubjectName = subjectNameSelect.options[subjectNameSelect.selectedIndex];
    const selectedSubjectGroup = subjectGroupSelect.options[subjectGroupSelect.selectedIndex];
    const moduleName = moduleNameInput.value;
    const curatorName = curatorNameInput.value;
    const groupName = groupNameInput.value;

    let isError = false;

    if (!moduleName) {
        moduleNameInput.classList.add("input-error");
        moduleNameError.classList.remove("display-none");
        isError = true;
    }

    if (!groupName) {
        groupNameInput.classList.add("input-error");
        groupNameError.classList.remove("display-none");
        isError = true;
    }

    if (isError) {
        return
    }

    const baseConfig = {
        subjectName: selectedSubjectName.textContent.trim(),
        subjectGroup: selectedSubjectGroup.value,
        moduleName: moduleName,
        primaryColor: selectedSubjectName.dataset.primaryColor,
        secondaryColor: selectedSubjectName.dataset.secondaryColor,
        curatorName: curatorName ? curatorName : null,
        groupName: groupName
    }

    return baseConfig;
}