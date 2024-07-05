let menuBotton = document.querySelector("#menu-button");
let modalBacgraund = document.querySelector("#modal_bacgraund");

let listPlaersOnTable = document.querySelector("#ThisTablePlaers");
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
            if (ower != oldOwer && ower.dataset.nameTable != "New") {
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
    hidens.append(...children);

    if (prop != "close") {
        modalBacgraund.style.visibility = "visible";
        if (prop === "table") {
            let tables = document.querySelector("#modal_table");
            tables.innerHTML = "";
            modalBacgraund.append(tables);
            tables.addEventListener("pointerdown", tablesList);
            tables.addEventListener("click", tablesList);

            listTable.forEach((item) => {
                tables.insertAdjacentHTML(
                    "beforeend",
                    `<section class='taible_page' data-dragon-name = 'taible' data-name-table = ${item}>
                        <img src="icons/New_table.png" />
                        <p>${item}</p>
                    </section>`
                );
            });

            return;
        } else if (prop === "plaers") {
            let newTable = document.querySelector("#modal_new_plaer_menu");
            modalBacgraund.append(newTable);
            createNewTable();
            newTable.addEventListener("click", createNewTable);
            newTable.addEventListener("input", createNewTable);
            return;
        } else {
            alert("Функція отримала не коректні данні");
        }
    }
    modalBacgraund.style.visibility = "hidden";
}
function openMenu() {
    mainMenu("table");
}

function tablesList(event) {
    let table = event.target.closest("section");
    switch (event.type) {
        case "click":
            if (table.dataset.nameTable === "New") {
                mainMenu("plaers");
            } else {
                thisTable = getLocalStorege("Table=" + table.dataset.nameTable);
                showThisTaplePlaer();
                mainMenu();
            }
            break;
        case "pointerdown":
            if (table.dataset.nameTable === "New") {
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
                    target: table,
                    cordsMouse: [event.pageX, event.pageY],
                    owerStyleClass: "ower",
                    handOff(ower, target) {
                        if (ower) {
                            ower.before(target);
                            listTable.splice(
                                listTable.indexOf(target.dataset.nameTable),
                                1
                            );
                            listTable.splice(
                                listTable.indexOf(ower.dataset.nameTable),
                                0,
                                target.dataset.nameTable
                            );
                            setLocalStorege("Table_List", listTable);
                            return true;
                        } else {
                            if (confirm("Ви бажаєте видалити елемент?")) {
                                target.remove();
                                listTable.splice(
                                    listTable.indexOf(target.dataset.nameTable),
                                    1
                                );
                                setLocalStorege("Table_List", listTable);
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

function createNewTable(event) {
    let listNP = document.querySelector("#modal_new_plaer_list");

    function plas() {
        let li = document.createElement("li");
        li.innerHTML = `<section class="create-plaers">
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

        listNP.append(li);
    }

    if (!event) {
        listNP.innerHTML = "";
        plas();
        return;
    } else if (event.type === "click") {
        function end() {
            let forms = document.forms.plaer;
            let inputs = forms.elements;
            thisTable.plaers = [];
            for (let x = 0; x < inputs.length; x += 2) {
                let name = inputs[x + 1].value;
                if (!name) break;

                thisTable.plaers.forEach((item) => {
                    if (item.name == name) {
                        function repetition(x) {
                            for (let item of thisTable.plaers) {
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
                thisTable.plaers.push(pl);
            }

            let name = prompt("Введіть назву столу");
            while (true) {
                if (listTable.includes(name)) {
                    name = prompt("Стіл із таким іменем уже існує");
                } else if (!name) {
                    if (confirm("Ви бажаєте скасувати створення столу?")) {
                        mainMenu("table");
                        thisTable = {};
                        return;
                    } else {
                        name = prompt("Введіть назву столу");
                    }
                } else {
                    thisTable.name = name;
                    mainMenu();
                    listTable.push(name);
                    setLocalStorege("Table_List", listTable);
                    setLocalStorege("Table=" + name, thisTable);
                    break;
                }
            }

            showThisTaplePlaer();
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

function showThisTaplePlaer() {
    listPlaersOnTable.innerHTML = "";
    let nameTable = document.querySelector("#name-table");
    nameTable.innerHTML = thisTable.name;
    for (let x = 0; x < thisTable.plaers.length; x++) {
        let plaer = document.createElement("li");
        plaer.innerHTML = ` <div class="plaer">
                                <div>
                                    <div
                                        class="color-ring"
                                        style="background-color: ${thisTable.plaers[x].color}"
                                    ></div>
                                    <p>${thisTable.plaers[x].name}</p>
                                </div>
                                    <div class = "score">
                                    <p>${thisTable.plaers[x].score}</p>
                                    <input type="number">
                                </div>
                            </div>`;
        listPlaersOnTable.append(plaer);
    }
}

function endMath() {
    let scoreL = document.querySelectorAll(".plaer");
    scoreL.forEach((item) => {
        let name = item.children[0].children[1].innerHTML;
        let thisScore = +item.children[1].children[0].innerHTML;
        let plas = +item.children[1].children[1].value;

        thisTable.plaers.find((item) => {
            if (item.name === name) {
                item.score = thisScore + plas;
            }
        });

        item.children[1].children[0].innerHTML = thisScore + plas;
        item.children[1].children[1].value = "";
    });
    thisTable.plaers.sort((a, b) => b.score - a.score);
    setLocalStorege("Table=" + thisTable.name, thisTable);
    // ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ
    showThisTaplePlaer();
    // ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ ПЕРЕРОБИТИ
}

// Збереження і завантаження

const getLocalStorege = (name) => JSON.parse(localStorage.getItem(name)) || [];

const setLocalStorege = (name, products) => {
    localStorage.setItem(name, JSON.stringify(products));
};

let listTable = getLocalStorege("Table_List");
if (!listTable.includes("New")) {
    listTable.unshift("New");
}
let thisTable = {};
// Збереження і завантаження

menuBotton.addEventListener("click", openMenu);
plasing.addEventListener("click", endMath);

openMenu();
