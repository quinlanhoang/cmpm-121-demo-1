import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "That's Hot";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

//button element
const button = document.createElement("button");
button.innerText = "🔥";

//counter element
const counter = document.createElement("div");
counter.id = "counter";
let count = 0;
counter.innerText = `You're ${count} times hotter!`;

//append counter
document.body.appendChild(counter);

//button listener
button.addEventListener("click", () => {
  count += 1;
  counter.innerText = `You're ${count} times hotter!`;
  alert(`You're on fire!`);
});

app.append(button);

//incremental counter
setInterval(() => {
    count += 1;
    counter.innerText = `You're ${count} times hotter!`;
}, 1000);
