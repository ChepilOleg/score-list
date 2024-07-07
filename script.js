let menuBotton = document.querySelector("#menu-button");
let modalBacgraund = document.querySelector("#modal_bacgraund");

let listElements = document.querySelector("#list-elements ");
let plasing = document.querySelector("#plasing");

function dragon({
    target,
    cordsMouse: [x, y],
    owerStyleClass,
    handOff = function () {
        return false;
    }
}) {
    target.ondragstart = function () {
        return false;
    };

    let oldPozition;
    let ower;
    let oldOwer;
    let dragonName = target.dataset.dragonName;

    if (target.previousElementSibling) {
        oldPozition = [target.previousElementSibling, "after"];
    } else if (target.nextElementSibling) {
        oldPozition = [target.nextElementSibling, "before"];
    } else if (target.parentElement) {
        oldPozition = [target.parentElement, "child"];
    }
    target.style.position = "absolute";
    modalBacgraund.append(target);

    function moveAt(x, y) {
        target.style.left = x - target.offsetWidth / 2 + "px";
        target.style.top = y - target.offsetHeight / 2 + "px";

        ower = document.elementsFromPoint(
            x + target.offsetWidth / 2,
            y + target.offsetHeight / 2
        );
        function findeSibling(ower) {
            for (let x = 0; x < ower.length; x++) {
                if (dragonName === ower[x]?.dataset.dragonName) {
                    return ower[x];
                }
            }
            return null;
        }

        ower = findeSibling(ower);
        if (ower === null) {
            document
                .querySelectorAll("." + owerStyleClass)
                .forEach((it) => it.classList.remove(owerStyleClass));
            oldOwer = null;
        } else {
            if (ower != oldOwer && ower.dataset.nameList != "New") {
                ower.classList.add(owerStyleClass);
                if (oldOwer) {
                    oldOwer.classList.remove(owerStyleClass);
                }
                oldOwer = ower;
            }
        }
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    function putInplace() {
        switch (oldPozition[1]) {
            case "after":
                oldPozition[0].after(target);
                break;
            case "before":
                oldPozition[0].before(target);
                break;
            case "child":
                oldPozition[0].append(target);
                break;
        }
    }

    function drop() {
        document.removeEventListener("pointermove", onMouseMove);
        target.style.position = "";
        if (!handOff(oldOwer, target)) {
            putInplace();
        }
        document.querySelectorAll("." + owerStyleClass).forEach((item) => {
            item.classList.remove(owerStyleClass);
        });
        document.removeEventListener("pointermove", onMouseMove);
        target.removeEventListener("pointerup", drop);
    }

    moveAt(x, y);
    document.addEventListener("pointermove", onMouseMove);
    target.addEventListener("pointerup", drop);
}

function mainMenu(prop = "close") {
    let hidens = document.querySelector("#hidens");
    let children = modalBacgraund.children;
    modalBacgraund.style.visibility = "visible";
    hidens.append(...children);

    if (prop != "close") {
        if (prop === "folder") {
            let folder = document.querySelector("#modal-folder");
            folder.innerHTML = "";
            modalBacgraund.append(folder);
            folder.addEventListener("pointerdown", folderListener);
            folder.addEventListener("click", folderListener);

            inFolder.forEach((item) => {
                folder.insertAdjacentHTML(
                    "beforeend",
                    `<section class='list' data-dragon-name = 'list' data-name-list = ${item}>
                        <img src="icons/d.png" />
                        <p>${item}</p>
                    </section>`
                );
            });
            return;
        } else if (prop === "newList") {
            let newList = document.querySelector("#modal-new-list");
            modalBacgraund.append(newList);
            createNewList();
            newList.addEventListener("click", createNewList);
            newList.addEventListener("input", createNewList);
            return;
        } else {
            alert("Функція отримала не коректні данні");
        }
    }
    modalBacgraund.style.visibility = "hidden";
}
function openMenu() {
    mainMenu("folder");
}

function folderListener(event) {
    let list = event.target.closest("section");
    switch (event.type) {
        case "click":
            if (list.dataset.nameList === "New") {
                mainMenu("newList");
            } else {
                thisList = getLocalStorege("List=" + list.dataset.nameList);
                showList();
                mainMenu();
            }
            break;
        case "pointerdown":
            if (list.dataset.nameList === "New") {
                return false;
            }
            event.target.addEventListener("pointerup", () => {
                clearTimeout(timer);
            });

            let timer = setTimeout(function () {
                event.target.oncontextmenu = function () {
                    return false;
                };

                dragon({
                    target: list,
                    cordsMouse: [event.pageX, event.pageY],
                    owerStyleClass: "ower",
                    handOff(ower, target) {
                        if (ower) {
                            ower.before(target);
                            inFolder.splice(
                                inFolder.indexOf(target.dataset.nameList),
                                1
                            );
                            inFolder.splice(
                                inFolder.indexOf(ower.dataset.nameList),
                                0,
                                target.dataset.nameList
                            );
                            setLocalStorege("inFolder", inFolder);
                            return true;
                        } else {
                            if (confirm("Ви бажаєте видалити елемент?")) {
                                target.remove();
                                inFolder.splice(
                                    inFolder.indexOf(target.dataset.nameList),
                                    1
                                );
                                setLocalStorege("inFolder", inFolder);
                                return true;
                            }
                            return false;
                        }
                    }
                });
            }, 500);
            break;
    }
}

function createNewList(event) {
    let listElements = document.querySelector("#new-list-elements");

    function plas() {
        let li = document.createElement("li");
        li.innerHTML = `<section class="create-element">
                            <input
                                type="color"
                                name="color"
                                class="create-color"
                            />
                            <input
                                type="text"
                                name="name"
                                class="create-name"
                            />
                        </section>`;

        listElements.append(li);
    }

    if (!event) {
        listElements.innerHTML = "";
        plas();
        return;
    } else if (event.type === "click") {
        function end() {
            let forms = document.forms["new-list"];
            let inputs = forms.elements;
            thisList.elements = [];
            for (let x = 0; x < inputs.length; x += 2) {
                let name = inputs[x + 1].value;
                if (!name) break;

                thisList.elements.forEach((item) => {
                    if (item.name == name) {
                        function repetition(x) {
                            for (let item of thisList.elements) {
                                if (item.name === name + `(${x})`) {
                                    return repetition(x + 1);
                                }
                            }
                            return x;
                        }
                        name += `(${repetition(1)})`;
                    }
                });

                let pl = {
                    color: inputs[x].value,
                    name: name,
                    score: 0
                };
                thisList.elements.push(pl);
            }

            let name = prompt("Введіть назву списку");
            while (true) {
                if (inFolder.includes(name)) {
                    name = prompt("Стіл із таким іменем уже існує");
                } else if (!name) {
                    if (confirm("Ви бажаєте скасувати створення столу?")) {
                        mainMenu("folder");
                        thisList = {};
                        return;
                    } else {
                        name = prompt("Введіть назву списку");
                    }
                } else {
                    thisList.name = name;
                    mainMenu();
                    inFolder.push(name);
                    setLocalStorege("inFolder", inFolder);
                    setLocalStorege("List=" + name, thisList);
                    break;
                }
            }

            showList();
        }

        if (event.target.id === "plas") {
            plas();
        } else if (event.target.id === "end") {
            end();
        }
    } else if (event.type === "input") {
        let inp = event.target.closest("li");
        if (inp === inp.parentElement.lastElementChild) {
            if (event.target.value) plas();
        }
    }
}

function showList() {
    listElements.innerHTML = "";
    let nameList = document.querySelector("#list-name");
    nameList.innerHTML = thisList.name;
    for (let x = 0; x < thisList.elements.length; x++) {
        let element = document.createElement("li");
        element.innerHTML = ` <div class="element">
                                <div>
                                    <div
                                        class="color-ring"
                                        style="background-color: ${thisList.elements[x].color}"
                                    ></div>
                                    <p>${thisList.elements[x].name}</p>
                                </div>
                                    <div class = "score">
                                    <p>${thisList.elements[x].score}</p>
                                    <input type="number">
                                </div>
                            </div>`;
        listElements.append(element);
    }
}

function endMath() {
    let scoreL = document.querySelectorAll(".element");
    scoreL.forEach((item) => {
        let name = item.children[0].children[1].innerHTML;
        let thisScore = +item.children[1].children[0].innerHTML;
        let plas = +item.children[1].children[1].value;

        thisList.elements.find((item) => {
            if (item.name === name) {
                item.score = thisScore + plas;
            }
        });

        item.children[1].children[0].innerHTML = thisScore + plas;
        item.children[1].children[1].value = "";
    });
    thisList?.elements?.sort((a, b) => b.score - a.score);
    setLocalStorege("List=" + thisList.name, thisList);
    showList();
}

function startJob() {
    if (inFolder.length > 1) {
        thisList = getLocalStorege("List=" + inFolder[1]);
        showList();
    } else {
        mainMenu("newList");
    }
}

// Збереження і завантаження

const getLocalStorege = (name) => JSON.parse(localStorage.getItem(name)) || [];

const setLocalStorege = (name, products) => {
    localStorage.setItem(name, JSON.stringify(products));
};

let inFolder = getLocalStorege("inFolder");
if (!inFolder.includes("New")) {
    inFolder.unshift("New");
}
let thisList = {};
// Збереження і завантаження

menuBotton.addEventListener("click", openMenu);
plasing.addEventListener("click", endMath);

startJob();
