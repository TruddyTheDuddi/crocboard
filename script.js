const components = {
    // Single button to advance 
    BTN_SINGLE: "button_single",

    // Single button with number of clicks required to advance
    BTN_COUNTER: "button_counter",

    // Double button, only one to advance other gives error message
    BTN_DOUBLE: "button_double",

    // User needs to wait
    TIMER: "timer",

    // Text input with a static answer
    INPUT_STATIC: "input_static",

    // Text input with a function to check the answer
    INPUT_FUNCTION: "input_function",

    // TBD...
}

function setupRadio() {
    // Create radio buttons action for each component type
    function loadComponentTemplate(type) {
        const template = document.querySelector(`#template-${type}`);
        const clone = template.content.cloneNode(true);
        const container = document.getElementById("component-content");
        container.innerHTML = ""; // clear previous
        container.appendChild(clone);
    }

    // Load template based on the selected radio button
    document.querySelectorAll('input[name="component"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            loadComponentTemplate(e.target.value);
        });
    });

    // Select first default
    document.querySelector('input[name="component"]:checked').dispatchEvent(new Event('change'));
}

// Store created levels
let levels = [
    {
        text: "You need to click this button 3 times to advance",
        data: {
            type: components.BTN_COUNTER,
            btn: "Do a push-up",
            count: 3, // Number of clicks required to advance
        }
    },
    {
        text: "Click the correct button to advance",
        data: {
            type: components.BTN_DOUBLE,
            btnOne: "Click me",
            btnTwo: "No, click me!",
            answerIdx: 0, // Index of the correct button (0 or 1)
            error: "Wrong button! Try again."
        }
    }
];
setupRadio();

// Helper to get cleaned value or null from input id
function getInputValue(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    const val = el.value.trim();
    return val === "" ? null : val;
}

const component = {
    // Extracts the component's data from the form inputs
    extract: () => {
        const selected = document.querySelector('input[name="component"]:checked').value;

        switch (selected) {
            case "empty":
                return null; // No component selected
            case "btn-single":
                return {
                    type: components.BTN_SINGLE,
                    btn: getInputValue("btn-text")
                };
            case "btn-counter":
                return {
                    type: components.BTN_COUNTER,
                    btn: getInputValue("btn-text"),
                    count: parseInt(getInputValue("btn-click-count")),
                };
            case "btn-double":
                const correctBtn = parseInt(document.querySelector('input[name="btn-correct"]:checked').value);
                return {
                    type: components.BTN_DOUBLE,
                    btnOne: getInputValue("btn-text-one"),
                    btnTwo: getInputValue("btn-text-two"),
                    answerIdx: correctBtn,
                    error: getInputValue("btn-error-msg")
                };
            case "text-static":
                return {
                    type: components.INPUT_STATIC,
                    placeholder: getInputValue("input-placeholder"),
                    submitText: getInputValue("submit-text"),
                    answerValue: getInputValue("correct-answer"),
                    error: getInputValue("error-msg")
                };
            case "text-dynamic":
                return {
                    type: components.INPUT_FUNCTION,
                    placeholder: getInputValue("input-placeholder"),
                    submitText: getInputValue("submit-text"),
                    answerFunction: getInputValue("function-name"),
                    error: getInputValue("error-msg")
                };
            case "timer":
                return {
                    type: components.TIMER,
                    time: parseInt(getInputValue("timer")),
                };
            default:
                return null;
        }
    },

    // Validates the component data
    validate: (component) => {
        if (!component) return true;

        switch (component.type) {
            case components.BTN_SINGLE:
                if (!component.btn) 
                    return "Button text is required.";
                break;
            case components.BTN_COUNTER:
                if (!component.btn) 
                    return "Button text is required.";
                if (!Number.isInteger(component.count) || component.count < 1)
                    return "Count must be a positive number.";
                break;
            case components.BTN_DOUBLE:
                if (!component.btnOne || !component.btnTwo) 
                    return "Both button texts are required.";
                if (component.answerIdx !== 0 && component.answerIdx !== 1) 
                    return "A correct button must be selected.";
                break;
            case components.INPUT_STATIC:
                if (!component.answerValue) 
                    return "Correct answer is required.";
                break;
            case components.INPUT_FUNCTION:
                if (!component.answerFunction) 
                    return "Function name is required.";
                break;
            case components.TIMER:
                if (!Number.isInteger(component.time) || component.time < 1) 
                    return "Time must be a positive number.";
                break;
        }

        return true;
    }
};

const LEVELS_PER_PAGE = 2;
let currentPage = 0;

function renderLevels() {
    const list = document.querySelector(".levels-list");
    const pages = document.querySelector(".levels-pages");
    const template = document.getElementById("template-level-list-item");
    list.innerHTML = "";
    pages.innerHTML = "";

    const totalPages = Math.ceil(levels.length / LEVELS_PER_PAGE);
    const start = currentPage * LEVELS_PER_PAGE;
    const pageLevels = [...levels].reverse().slice(start, start + LEVELS_PER_PAGE);

    // Render each level
    pageLevels.forEach((level) => {
        const node = template.content.cloneNode(true).querySelector(".level-list-item");
        node.querySelector(".text").textContent = level.text;

        const values = node.querySelector(".component-data");
        if (level.data) {
            Object.entries(level.data).forEach(([key, value]) => {
                const k = document.createElement("span");
                k.className = "key";
                k.textContent = key;
                const v = document.createElement("span");
                v.className = "value";
                v.textContent = value;
                values.appendChild(k);
                values.appendChild(v);
            });
        }
        list.appendChild(node);

        // Event handlers
        node.querySelector(".btn-delete").addEventListener("click", () => {
            const index = levels.indexOf(level);
            if (index > -1) {
                levels.splice(index, 1);
                isDirty = true;
                renderLevels();
            }
        });

        node.querySelector(".btn-edit").addEventListener("click", () => {
            let toEdit = { ...level };
            delete toEdit._index; // Remove index for editing (to avoid confusion)

            document.getElementById("text-edit").value = JSON.stringify(toEdit, null, 4);
            document.getElementById("level-edit").textContent = level._index + 1; // Display level index

            // Set new event listener for saving edits
            const editButton = document.getElementById("save-edit");
            editButton.onclick = () => {
                editLevel(level._index);
                // Reset the save button to its original function
                editButton.onclick = () => {};
            };
            document.getElementById("cancel-edit").onclick = () => {
                document.getElementById("text-edit").value = "";
                document.getElementById("level-edit").textContent = "#";
                editButton.onclick = () => {};
            };
        });
    });

    // Render pages
    for (let i = 0; i < totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = "page";
        pageBtn.textContent = `${i + 1}`;

        // Disabled button for current page
        if (i === currentPage) {
            pageBtn.disabled = true;
        }
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderLevels();
        });
        pages.appendChild(pageBtn);
    }
}

// Save level
function saveLevel() {
    const text = document.getElementById("text").value.trim();
    const data = component.extract();

    if (!text) {
        alert("Bruh! Text input cannot be empty.");
        return;
    }

    const validation = component.validate(data);
    if (validation !== true) {
        alert(validation);
        return;
    }

    const entry = {
        text,
        data
    };
    levels.push(entry);
    isDirty = true;

    // Clear stuff
    document.getElementById("text").value = "";
    setupRadio();

    console.log("Saved level:", entry);

    // Re-render levels
    renderLevels();
}

// Edit level
function editLevel(idx) {
    const raw = document.getElementById("text-edit").value.trim();
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        alert("Invalid JSON format. Please check your input.");
        return;
    }

    const { text, data } = parsed;

    const validation = component.validate(data);
    if (validation !== true) {
        alert(validation);
        return;
    }

    levels[idx] = { text, data, _index: idx };
    isDirty = true;

    // Clear edit fields
    document.getElementById("text-edit").value = "";
    document.getElementById("level-edit").textContent = "#";

    // Re-render levels
    renderLevels();
}

// Save events
document.getElementById("btn").addEventListener("click", saveLevel);
document.getElementById("text").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        saveLevel();
    }
});

// Setup idx
// let currentIdx = levels.length;
// levels.forEach((level, idx) => {
//     level._index = idx;
// });

function updateShortcutHint() {
    const isMac = navigator.userAgentData
        ? navigator.userAgentData.platform.toLowerCase().includes('mac')
        : navigator.userAgent.toLowerCase().includes('mac');
    const hint = document.getElementById("shortcut-hint");
    if (hint) {
        hint.innerHTML = `<kbd>${isMac ? "Cmd ⌘" : "Ctrl"}</kbd> + <kbd>Enter</kbd>`;
    }
}
updateShortcutHint();
renderLevels();

// Warn leave
let isDirty = false;
window.addEventListener("beforeunload", function (e) {
    if (isDirty) {
        e.preventDefault();
    }
});

const file = {
    // Import file
    import: (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (!Array.isArray(imported)) throw new Error("Invalid format: Expected an array.");
                levels = imported.map((lvl, idx) => ({ ...lvl, _index: idx })); // Set _index for each level
                currentPage = 0;
                isDirty = true;
                renderLevels();
                alert("Levels imported successfully!");
            } catch (err) {
                alert("Failed to import: " + err.message);
            }
        };
        reader.readAsText(file);
    },

    // Export file
    export: () => {
        const getFormattedDate = () => {
            const now = new Date();
            const dd = String(now.getDate()).padStart(2, '0');
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const yyyy = now.getFullYear();
            return `${dd}_${mm}_${yyyy}`;
        };

        const json = JSON.stringify(levels.map(({ _index, ...rest }) => rest), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `odile_${getFormattedDate()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Import JSON button
document.getElementById("import-btn").addEventListener("click", () => {
    document.getElementById("import-file").click();
});

// File import
document.getElementById("import-file").addEventListener("change", (e) => {
    file.import(e);
    document.getElementById("import-file").value = ""; // Reset file input
});

// Export JSON
document.getElementById("export-btn").addEventListener("click", () => {
    file.export();
});