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

button.addEventListener("click", () => {
    alert(`You're on fire!`);
});

app.append(button);
