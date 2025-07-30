//если надо очистить сохранение
//localStorage.clear();

//ОБЪЯВЛЕНИЕ ПЕРЕМЕНЫХ ДЛЯ КОДА
let score = localStorage.getItem("score")
	? Number(localStorage.getItem("score"))
	: 0;
let countClick = 100;
let energy = localStorage.getItem("energy")
	? Number(localStorage.getItem("energy"))
	: 500;
let fullEnergy = localStorage.getItem("fullEnergy")
	? Number(localStorage.getItem("fullEnergy"))
	: 500;
let percentEnergy;

let priseLvlEnergy = localStorage.getItem("priseLvlEnergy")
	? Number(localStorage.getItem("priseLvlEnergy"))
	: 300;
let lvlEnergy = localStorage.getItem("lvlEnergy")
	? Number(localStorage.getItem("lvlEnergy"))
	: 0;
let countEnergy = localStorage.getItem("countEnergy")
	? Number(localStorage.getItem("countEnergy"))
	: 100;

let countRestart = 0;
let today = new Date().toDateString();
let saveDataGame = localStorage.getItem("countRestartDate");
if (today !== saveDataGame) {
	countRestart = 0;
	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
} else {
	countRestart = Number(localStorage.getItem("countRestart"));
}

//переменные для отображения на странице HTML
let scoreHTML = document.getElementById("score");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");

let priseLvlEnergyHTML = document.getElementById("priceLvlEnergy");
let lvlEnergyHTML = document.querySelectorAll(".lvlFullEnergy");
let countEnergyHTML = document.getElementById("countEnergy");

let countRestartHTML = document.querySelectorAll(".lvlRestart");

//СТРУКТУРА ДАННЫХ ДЛЯ КАРТОЧЕК ПАССИВНОГО ДОХОДА
let cardsData = {
	1: {
		img: "Белый2.jpg",
		title: "Крылья",
		level: 0,
		bonus: 150,
		price: 500,
		coef: 3.7,
	},
	2: {
		img: "БЕЛЫЙ3.jpg",
		level: 0,
		bonus: 200,
		price: 1000,
		coef: 3,
	},
	3: {
		img: "черный1.jpg",
		title: "крылья",
		level: 0,
		bonus: 250,
		price: 1200,
		coef: 2.7,
	},
	4: {
		img: "Черный2.jpg",
		title: "крылья",
		level: 0,
		bonus: 300,
		price: 1500,
		coef: 3,
	},
	5: {
		img: "Белый2.jpg",
		title: "крылья",
		level: 0,
		bonus: 350,
		price: 1800,
		coef: 3.5,
	},
};

let cardsPassive = document.querySelectorAll(".cardPassive");
cardsPassive.forEach(card => {
	let id = card.getAttribute("data-id");
	let data = cardsData[id];
	if (data) {
		card.innerHTML = `
	<div class="imageCard"
	 style="background-image: url('${data.img}'); background-size: cover; " >
	<p>ур. <span id="lvl${data.id}">${data.level}</span></p>
	</div>
	<p class="textCard">${data.title}</p>`;
	}
});

let obj = document.getElementById("objectPanel");
if (obj) {
	obj.addEventListener("touchstart", clicker);
}
let obj2 = document.getElementById("clickFullEnergy");
let obj2Pay = document.getElementById("payLvlEnergy");
if (obj2) {
	obj2.addEventListener("touchstart", function () {
		if (score < priseLvlEnergy) {
			document.getElementById("payLvlEnergy").style.background = "red";
		}
		document.getElementById("screenLvlEnergy").showModal();
	});
	obj2Pay.addEventListener("touchstart", payLvlEnergy);
}
let obj3 = document.getElementById("clickRestart");
let obj3Pay = document.getElementById("payRestart");
if (obj3) {
	obj3.addEventListener("touchstart", function () {
		document.getElementById("screenRestart").showModal();
	});
	obj3Pay.addEventListener("touchstart", payRestart);
}

//ФУНКЦИЯ ПОКУПКИ ВОССТАНАВЛЕНИЯ ЭНЕРГИИ
function payRestart() {
	if (countRestart < 6) {
		energy = fullEnergy;
		countRestart++;
		saveData();
		dataScreen2();
	}
}

//ФУНКЦИЯ ПОКУПКИ УРОВНЯ ЗАПАСА ЗНЕРГИИ
function payLvlEnergy() {
	if (score >= priseLvlEnergy) {
		score -= priseLvlEnergy;
		lvlEnergy++;
		fullEnergy += countEnergy;
		priseLvlEnergy = Math.round(priseLvlEnergy * 3.25);
		countEnergy += 50;
		saveData();
		dataScreen2();
	}
}

//ФУНКЦИЯ НА СОХРАНЕНИЕ ДАННЫХ В ЛОКАЛЬНОЕ ХРАНИЛИЩЕ
function saveData() {
	localStorage.setItem("score", score);
	localStorage.setItem("energy", energy);
	localStorage.setItem("fullEnergy", fullEnergy);

	localStorage.setItem("lvlEnergy", lvlEnergy);
	localStorage.setItem("priseLvlEnergy", priseLvlEnergy);
	localStorage.setItem("countEnergy", countEnergy);

	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
}

//ФУНКЦИЯ НА ЗАГРУЗКУ ДАННЫХ НА HTML страницы играть
function dataScreen() {
	scoreHTML.innerText = score;
	energyHTML.innerText = energy;
	fillEnergy();
}
//ФУНКЦИЯ НА ЗАГРУЗКУ ДАННЫХ НА HTML страницы доход
function dataScreen2() {
	dataScreen();
	lvlEnergyHTML.forEach(element => {
		element.innerText = lvlEnergy;
	});
	priseLvlEnergyHTML.innerText = priseLvlEnergy;
	countEnergyHTML.innerText = countEnergy;

	countRestartHTML.forEach(element => {
		element.innerText = countRestart;
	});
}

//проверка страницы запуска
let path = window.location.pathname;
if (path.includes("index.html")) dataScreen();
else if (path.includes("earnings.html")) dataScreen2();
function clicker(event) {
	if (energy >= countClick) {
		score += countClick;
		energy -= countClick;
		scoreHTML.innerText = score;
		energyHTML.innerText = energy;
		fillEnergy();

		let img = event.currentTarget.querySelector("#objectImg");
		img.style.transform = "scale(0.9)";
		setTimeout(() => {
			img.style.transform = "";
		}, 200);
		const plus = document.createElement("div");
		plus.className = "plus";
		plus.innerText = "+" + countClick;
		const panel = event.currentTarget;
		const rect = panel.getBoundingClientRect();
		plus.style.left = "${event.clientX - rect.left}px";
		plus.style.top = "${event.clientY - rect.top}px";
		panel.appendChild(plus);
		setTimeout(() => {
			plus.remove();
		}, 2200);

		saveData();
	}
}

function fillEnergy() {
	percentEnergy = (energy * 100) / fullEnergy;
	energyFillHTML.style.width = percentEnergy + "%";
}

//функция восстанавления энергии
function regenerateEnergy() {
	if (energy < fullEnergy) {
		energy++;
		energyHTML.innerText = energy;
		fillEnergy();
		saveData();
	}
}
setInterval(regenerateEnergy, 1000);
