import "./style.css";

// constants
const GAME_NAME = "That's Hot";
document.title = GAME_NAME;

const PRICE_FACTOR = 1.15;

// DOM Elements
const app: HTMLDivElement = document.querySelector("#app")!;
const header = createHeader();
const flameButton = createFlameButton();
const counter = createCounter();
let count = 0;
let lastTimestamp = 0;
let fractionalCount = 0;
let growthRate = 0;

// upgrade system
type Upgrade = {
  name: string;
  cost: number;
  growthRateIncrement: number;
  purchased: number;
};

const upgrades: Upgrade[] = [
  { name: "Matches", cost: 10, growthRateIncrement: 0.1, purchased: 0 },
  { name: "Campfires", cost: 100, growthRateIncrement: 2, purchased: 0 },
  { name: "Stovetops", cost: 1000, growthRateIncrement: 50, purchased: 0 },
];

// UI elements
function createGrowthRateDisplay(): HTMLDivElement {
  const growthRateDisplay = document.createElement("div");
  growthRateDisplay.id = "growth-rate-display";
  growthRateDisplay.innerText = `Current Growth Rate: ${growthRate.toFixed(1)}/sec`;
  return growthRateDisplay;
}

function createStatusDisplay(): HTMLDivElement {
  const statusDisplay = document.createElement("div");
  statusDisplay.id = "status-display";
  statusDisplay.innerText = getStatusDisplayText();
  return statusDisplay;
}

// functions
function createHeader(): HTMLHeadingElement {
  const header = document.createElement("h1");
  header.innerHTML = GAME_NAME;
  return header;
}

function createFlameButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerText = "🔥";
  button.addEventListener("click", handleButtonClick);
  return button;
}

function createCounter(): HTMLDivElement {
  const counter = document.createElement("div");
  counter.id = "counter";
  counter.innerText = getCounterText(0);
  return counter;
}

function createUpgradeButton(upgrade: Upgrade): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerText = `${upgrade.name} (${upgrade.cost})`;
  button.style.opacity = "0.5";
  button.id = `${upgrade.name.toLowerCase()}-button`;
  button.addEventListener("click", () => handleUpgradeClick(upgrade));
  updateUpgradeButtonState(button, upgrade);
  return button;
}

function handleButtonClick() {
  incrementCounter(1);
  alert("You're on fire!");
}

function handleUpgradeClick(upgrade: Upgrade) {
  if (count >= upgrade.cost) {
    growthRate += upgrade.growthRateIncrement;
    incrementCounter(-upgrade.cost);
    upgrade.purchased++;

    upgrade.cost *= PRICE_FACTOR;

    updateGrowthRateDisplay();
    updateStatusDisplay();
    upgradeButtons.forEach((button, i) => {
      // upgrade inner text
      button.innerText = `${upgrades[i].name} (${upgrades[i].cost.toFixed(1)})`;
      updateUpgradeButtonState(button, upgrades[i]);
    });
  }
}

function incrementCounter(amount: number) {
  fractionalCount += amount;
  const integerIncrement = Math.floor(fractionalCount);
  count += integerIncrement;
  fractionalCount -= integerIncrement;
  updateCounterText();
}

function getCounterText(count: number): string {
  return `You're ${Math.floor(count)} times hotter!`;
}

function getStatusDisplayText(): string {
  let statusText = "Upgrades Bought: ";
  upgrades.forEach((upgrade) => {
    statusText += `${upgrade.name}: ${upgrade.purchased}, `;
  });
  return statusText.slice(0, -2);
}

function updateCounterText() {
  counter.innerText = getCounterText(count);
}

function updateUpgradeButtonState(button: HTMLButtonElement, upgrade: Upgrade) {
  button.disabled = count < upgrade.cost;
  button.style.opacity = count < upgrade.cost ? "0.5" : "1.0";
}

function updateGrowthRateDisplay() {
  const growthRateElement = document.getElementById("growth-rate-display");
  if (growthRateElement) {
    growthRateElement.innerText = `Current Growth Rate: ${growthRate.toFixed(1)}/sec`;
  }
}

function updateStatusDisplay() {
  const statusElement = document.getElementById("status-display");
  if (statusElement) {
    statusElement.innerText = getStatusDisplayText();
  }
}

function animate(currentTimestamp: number) {
  if (lastTimestamp !== 0) {
    const elapsed = (currentTimestamp - lastTimestamp) / 1000;

    incrementCounter(growthRate * elapsed);

    flameButton.style.transform = `scale(${1 + count * 0.02})`;

    upgradeButtons.forEach((button, i) =>
      updateUpgradeButtonState(button, upgrades[i]),
    );
  }
  lastTimestamp = currentTimestamp;

  requestAnimationFrame(animate);
}

// initial Setup
const statusDisplay = createStatusDisplay();
const growthRateDisplay = createGrowthRateDisplay();
app.append(header, flameButton);
document.body.append(growthRateDisplay, counter);

const upgradeButtons: HTMLButtonElement[] = upgrades.map((upgrade) => {
  const button = createUpgradeButton(upgrade);
  document.body.appendChild(button);
  return button;
});

document.body.appendChild(statusDisplay);

// start the animation loop
requestAnimationFrame(animate);
