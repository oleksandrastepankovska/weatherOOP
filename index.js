const form = document.querySelector(".form");
const input = document.querySelector(".input");
const errorMessage = document.querySelector(".errorMessage");
const list = document.querySelector(".cities");
const dataFromStorage = JSON.parse(localStorage.getItem("data"));

let array = [];

class DomMethods {
  constructor(data, index = array.length - 1) {
    this.data = data;
    this.index = index;
  }

  render() {
    const { main, name, sys, weather } = this.data;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const li = document.createElement("li");
    li.classList.add("city");
    const output = `
      <div id="del${this.index}" class="del" data-index="${this.index}">X</div>
      <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
      </h2>
      <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
      <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0].description}">
          <figcaption>${weather[0].description}</figcaption>
      </figure>
      `;
    li.innerHTML = output;
    list.appendChild(li);
    const delBtn = document.querySelector(`#del${this.index}`);
    delBtn.addEventListener("click", onDelete);
  }
}

if (dataFromStorage) {
  array = dataFromStorage;
  array.forEach((item, index) => {
    const domMethods = new DomMethods(item, index);
    domMethods.render();
  });
}

function onDelete(e) {
  const { index } = e.target.dataset;
  const newArray = array.filter((_, itemIndex) => index != itemIndex);
  document.createElement("li");
  const lis = document.querySelectorAll("li");
  lis.forEach((li) => li.remove());
  newArray.forEach((item, itemIndex) => {
    const domMethods = new DomMethods(item, index);
    domMethods.render();
  });
  array = newArray;
  localStorage.setItem("data", JSON.stringify(newArray));
}

class Api {
  fetch(inputValue) {
    const apiKey = "e8c9e3bf970879716bf489660566ca43";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404" || data.cod === "400") return;
        array.push(data);
        localStorage.setItem("data", JSON.stringify(array));
        const domMethods = new DomMethods(data);
        domMethods.render();
      })
      .catch(() => {
        errorMessage.textContent = "Please search for a valid city 😩";
      });

    errorMessage.textContent = "";
    form.reset();
    input.focus();
  }
}

const api = new Api();
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputValue = input.value;
  api.fetch(inputValue);
});
