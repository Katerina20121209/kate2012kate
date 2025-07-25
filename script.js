//ОБЪЯВЛЕНИЕ ПЕРЕМЕНЫХ ДЛЯ КОДА
let score = localStorage.getItem("score")
	? Number(localStorage.getItem("score"))
	: 0;
let countClick = 1;
let energy = localStorage.getItem("energy")
	? Number(localStorage.getItem("energy"))
	: 500;
let fullEnergy = 500;
let percentEnergy;

//переменные для отображения на странице HTML
let scoreHTML = document.getElementById("score");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");

let obj = document.getElementById("objectPanel");
if (obj) {
	obj.addEventListener("touchstart", clicker);
}

//ФУНКЦИЯ НА СОХРАНЕНИЕ ДАННЫХ В ЛОКАЛЬНОЕ ХРАНИЛИЩЕ
function saveData() {
	localStorage.setItem("score", score);
	localStorage.setItem("energy", energy);
}

//ФУНКЦИЯ НА ЗАГРУЗКУ ДАННЫХ НА HTML страницы
function dataScreen() {
	scoreHTML.innerText = score;
	energyHTML.innerText = energy;
	fillEnergy();
}
dataScreen();

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
