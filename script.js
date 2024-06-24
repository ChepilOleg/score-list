let menu = document.querySelector("#menu");
let hidens = document.querySelector("#hidens");
let modalBacgraund = document.querySelector("#modal_bacgraund");
let tables = document.querySelector("#modal_table");
let newTable = document.querySelector("#modal_new_plaer_menu");
let listNP = document.querySelector("#modal_new_plaer_list");
let listPlaersOnTable = document.querySelector("#ThisTablePlaers");
let plasing = document.querySelector("#plasing");

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

function openMenu() {
    tables.innerHTML = "";
    modalBacgraund.style.visibility = "visible";
    modalBacgraund.append(tables);
    console.log(listTable);
    listTable.forEach((item) => {
        let table = document.createElement("section");
        table.innerHTML = ` <img src="icons/New_table.png" />
                            <p>${item}</p>`;
        table.dataset.nameTable = item;
        tables.append(table);
    });
}
function tablesList(event) {
    let table = event.target.closest("section");
    if (table.dataset.nameTable === "New") {
        modalBacgraund.append(newTable);
        plas();
        plas();
        hidens.append(tables);
    } else {
        thisTable = getLocalStorege("Table=" + table.dataset.nameTable);
        showThisTaplePlaer();
        listNP.innerHTML = "";
        hidens.append(newTable);
        modalBacgraund.style.visibility = "hidden";
    }
}

function createNewTable(event) {
    function end() {
        let forms = document.forms[0];
        let inputs = forms.elements;
        thisTable.plaers = [];
        for (let x = 0; x < inputs.length; x += 2) {
            let name = inputs[x + 1].value;
            if (!name) break;
            thisTable.plaers.forEach((item) => {
                while (true) {
                    if (item.name == name) {
                        name = prompt("Такий гравець уже є '" + name + "'");
                    } else {
                        break;
                    }
                }
            });

            let pl = {
                color: inputs[x].value,
                name: name,
                score: 0
            };
            thisTable.plaers.push(pl);
        }

        while (true) {
            let name = prompt("Ведіть назву столу");

            if (listTable.includes(name)) {
                alert("Такий стіл вже існує");
            } else if (name != "") {
                thisTable.name = name;
                listNP.innerHTML = "";
                hidens.append(newTable);
                modalBacgraund.style.visibility = "hidden";
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
        console.log(item);
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

menu.addEventListener("click", openMenu);
tables.addEventListener("click", tablesList);
newTable.addEventListener("click", createNewTable);
plasing.addEventListener("click", endMath);

openMenu();
