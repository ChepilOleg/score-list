let start = () => {
    class Player {
        // _score = 0;
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

    let players = [];
    getLocalStorege().forEach((item) => {
        let pl = new Player(item._name, item._color, item._score);
        players.push(pl);
    });
    let list = document.querySelector(".list");
    let main = document.querySelector(".create_new_person");
    let listNewPersone = document.querySelector(".list_new_person");
    let pals = document.querySelector(".plas");
    let end = document.querySelector(".end");
    let newTable = document.querySelector(".new-table");
    let plasing = document.querySelector(".plasing");

    let createANewTable = () => {
        if (!confirm("Бажаєте розпочати нову гру?")) return;
        main.style.display = "block";
        newPlayerInput();
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
    };

    let plassing = () => {
        let scoreList = document.querySelectorAll(".score");
        let namList = document.querySelectorAll(".nam");
        let i = 0;
        scoreList.forEach((item) => {
            console.log(item);
            item.innerHTML = players[i].plas(namList[i].value);
            namList[i].value = "";
            i++;
        });
        showList();
        setLocalStorege(players);
    };

    showList();
    let showNewList = () => {
        readInp();
        showList();
    };

    newTable.addEventListener("click", () => createANewTable());
    pals.addEventListener("click", () => newPlayerInput());
    end.addEventListener("click", () => showNewList());
    plasing.addEventListener("click", () => plassing());
};
const getLocalStorege = () => {
    return JSON.parse(localStorage.getItem("pl")) || [];
};
const setLocalStorege = (task) => {
    localStorage.setItem("pl", JSON.stringify(task));
};
start();
