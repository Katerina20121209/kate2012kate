//если надо очистить сохранение
//localStorage.clear();

//ОБЪЯВЛЕНИЕ ПЕРЕМЕНЫХ ДЛЯ КОДА
let score = localStorage.getItem("score")
	? Number(localStorage.getItem("score"))
	: 0;
let countClick = 1;
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
let scoreInHour = localStorage.getItem("scoreInHour")
	? Number(localStorage.getItem("scoreInHour"))
	: 0;

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

let scoreInHourHTML = document.getElementById("scoreInHour");

//СТРУКТУРА ДАННЫХ ДЛЯ КАРТОЧЕК ПАССИВНОГО ДОХОДА
let cardsData = {
	1: {
		img: "СБелый.jpg",
		title: "Огонь",
		level: 0,
		bonus: 150,
		price: 500,
		coef: 3.7,
	},
	2: {
		img: "черный1.jpg",
		title: "Крылья",
		level: 0,
		bonus: 200,
		price: 1000,
		coef: 3,
	},
	3: {
		img: "БЕЛЫЙ3.jpg",
		title: "Хвост",
		level: 0,
		bonus: 250,
		price: 1200,
		coef: 2.7,
	},
	4: {
		img: "Черный2.jpg",
		title: "Перья",
		level: 0,
		bonus: 300,
		price: 1500,
		coef: 3,
	},
	5: {
		img: "НБелый.jpg",
		title: "Когти",
		level: 0,
		bonus: 350,
		price: 1800,
		coef: 3.5,
	},
};

//ПРИ ЗАГРУЗКЕ ВОССТАНАВЛИВАЕМ УРОВНИ ПАССИВНОГО ДОХОДА
Object.keys(cardsData).forEach(id => {
	let saveCards = JSON.parse(localStorage.getItem(`card${id}`));
	if (saveCards) {
		cardsData[id] = saveCards;
	}
});

let cardsPassive = document.querySelectorAll(".cardPassive");
cardsPassive.forEach(card => {
	let id = card.getAttribute("data-id");
	let data = cardsData[id];
	if (data) {
		card.innerHTML = `
	<div class="imageCard"
	 style="margin-left: 5%;
	       padding-left: 1%;
	 background-image: url('${data.img}');
	  background-size: cover; " >
	<p>ур. <span id="lvl${id}" class="lvlPassive">${data.level}</span></p>
	</div>
	<p class="textCard" style="text-align: center; margin-top6 8px" >${data.title}</p>`;
	}
});

let dialog = document.getElementById("screenPassive");
cardsPassive.forEach(card => {
	let tochStartX = 0;
	let tochEndX = 0;
	card.addEventListener("touchstart", event => {
		tochStartX = event.changedTouches[0].screenX;
	});
	card.addEventListener("touchend", event => {
		tochEndX = event.changedTouches[0].screenX;
		if (Math.abs(tochStartX - tochEndX) < 10) {
			let id = card.getAttribute("data-id");
			let data = cardsData[id];
			if (data) {
				dialog.innerHTML = `<form method="dialog">
			 <button class="closeButton">✖</button>
			 <img class="imgDialog" src="${data.img}">
			 <h2>${data.title}</h2>
			 <div class="textContainer">
        <p>ур.<span class="lvlPassive">${data.level}</span></p>
				<img src="Деньги.png"/>
				<p>+<span class="bonusPassive">${data.bonus}</span>в час</p>
			 </div>
			 <button class=" pay payPassiveCard">
				<p>Купить за <span class="pricePassive">${data.price}</span></p>
			</button>
		 	</form>`;
				if (score < data.price) {
					dialog.querySelector(".payPassiveCard").style.background = "red";
				}
				dialog.showModal();
				dialog
					.querySelector(".payPassiveCard")
					.addEventListener("touchstart", event => {
						payPassiveCard(id, data);
					});
			}
		}
	});
});

function payPassiveCard(id, data) {
	if (score >= data.price) {
		score -= data.price;
		data.level++;
		scoreInHour += data.bonus;
		data.price = Math.round(data.price * data.coef);
		data.bonus = Math.round((data.bonus * data.coef) / 1.5);

		localStorage.setItem(`card${id}`, JSON.stringify(data));
		document.getElementById(`lvl${id}`).innerText = data.level;
		saveData();
		dataScreen();
	}
}

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
	localStorage.setItem("scoreInHour", scoreInHour);
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
	scoreHTML.innerText = Math.round(score);
	energyHTML.innerText = energy;
	fillEnergy();
	scoreInHourHTML.innerText = scoreInHour;
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
		scoreHTML.innerText = Math.round(score);
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
	score += score / 3600;
	scoreHTML.innerText = Math.round(score);
	saveData();
}
setInterval(regenerateEnergy, 1000);

//ВЫЗЫВАЕТСЯ ПРИ ПОКИДАНИИ СТРАНИЦЫ
window /
	addEventListener("beforeunload", () => {
		localStorage.setItem("lastVisit", Date.now());
	});

//ВЫЗЫВАЕТСЯ ПРИ ЗАГРУЗКИ СТРАНИЦЫ
window.addEventListener("load", () => {
	let lastVisit = localStorage.getItem("lastVisit");
	let nowVisit = Date.now();
	if (nowVisit - lastVisit > 30 * 1000 && lastVisit) {
		let hoursAway = (nowVisit - parseInt(lastVisit)) / (1000 * 60 * 60);
		if (hoursAway > 3) hoursAway = 3;

		//начисление монет
		let offlineScore = Math.round(hoursAway * scoreInHour);
		score += offlineScore;
		scoreHTML.innerText = score;

		//НАЧИСЛЕНИЕ ЭНЕГИИ
		let offlineEnergy = Math.round(hoursAway * 3600);
		energy = Math.min(energy + offlineEnergy, fullEnergy);
		energyHTML.innerText = energy;

		alert(`За ваше отсутствие заработано ${offlineScore} баксов`);
	}
});
