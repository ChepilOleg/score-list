let taibles = {};
let players = [];
let nameTaible = "";
let list = document.querySelector(".list");
let main = document.querySelector(".create_new_person");
let listNewPersone = document.querySelector(".list_new_person");

let start = () => {
    let pals = document.querySelector(".plas");
    let plasing = document.querySelector(".plasing");
    let newTable = document.querySelector(".new-table");
    let end = document.querySelector(".end");
    newTable.addEventListener("click", () => createANewTable());
    pals.addEventListener("click", () => newPlayerInput());
    end.addEventListener("click", () => showNewList());
    plasing.addEventListener("click", () => plassing());
};

class Player {
    constructor(name, color, score) {
        this._name = name;
        this._color = color;
        this._score = score || 0;
    }

    plas = (value) => {
        this._score += +value;
        return this._score + " + ";
    };

    get score() {
        return +this._score;
    }

    showPlayer = () => {
        return `<section>
        <div class="marker"style="background-color: ${this._color}"></div>
        <p class="name">${this._name}</p>
        </section>
        <section>
        <p class="score">${this._score} + </p>
        <input class="nam" type="number" />
        </section> `;
    };
}

let createANewTable = () => {
    if (!confirm("Бажаєте розпочати нову гру?")) return;
    let x = getLocalStorege("taibles");
    nameTaible = prompt(x.join(" | "));
    if (!nameTaible) {
        return;
    } else if (x.includes(nameTaible)) {
        unMemoring();
        showList();
    } else {
        main.style.display = "block";
        taibles[nameTaible] = [];

        newPlayerInput();
    }
};

let newPlayerInput = () => {
    let personInput = document.createElement("section");
    personInput.innerHTML = `<input class="color-inp" type="color" />
    <input class="name-inp" type="text" />`;
    listNewPersone.append(personInput);
};

let readInp = () => {
    list.innerHTML = "";
    players = [];
    let inputs = document.querySelectorAll("input");
    for (let i = 0; i < inputs.length; i += 2) {
        if (!inputs[i + 1].value) break;
        let player = new Player(inputs[i + 1].value, inputs[i].value);
        players.push(player);
    }
    main.style.display = "none";
    listNewPersone.innerHTML = "";
    console.log(players);
    return;
};

let showList = () => {
    list.innerHTML = "";
    players.sort((a, b) => {
        if (a.score > b.score) return -1;
    });
    players.forEach((item) => {
        let li = document.createElement("li");
        li.innerHTML = item.showPlayer();
        list.append(li);
    });
    taibles[nameTaible] = players;
};

let plassing = () => {
    let scoreList = document.querySelectorAll(".score");
    let namList = document.querySelectorAll(".nam");
    let i = 0;
    scoreList.forEach((item) => {
        item.innerHTML = players[i].plas(namList[i].value);
        namList[i].value = "";
        i++;
    });
    showList();
    setLocalStorege(`table=${nameTaible}`, players);
};

const getLocalStorege = (name) => {
    return JSON.parse(localStorage.getItem(name)) || [];
};
const setLocalStorege = (name, task) => {
    localStorage.setItem(name, JSON.stringify(task));
};
let taibleList = () => {
    let taibles = getLocalStorege("taibles");
    if (!nameTaible) {
        nameTaible = taibles[0];
    } else {
        nameTaible = prompt(taibles.join(" / "));
    }
};
taibleList();
let unMemoring = () => {
    players = [];
    getLocalStorege(`table=${nameTaible}`).forEach((item) => {
        let pl = new Player(item._name, item._color, item._score);
        players.push(pl);
    });
};
unMemoring();
showList();
let showNewList = () => {
    readInp();
    showList();
    x = getLocalStorege("taibles");
    x.push(nameTaible);
    setLocalStorege("taibles", x);
    setLocalStorege(`table=${nameTaible}`, players);
    console.log(players);
};
start();
