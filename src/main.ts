import "./style.css";

// Constants
const GAME_NAME = "That's Hot";
document.title = GAME_NAME;

const PRICE_FACTOR = 1.15;

// Initial State
let count = 0;
let lastTimestamp = 0;
let fractionalCount = 0;
let growthRate = 0;

// Interfaces and Data
interface Item {
  name: string;
  fireCost: number;
  heatRate: number;
}

const availableItems: Item[] = [
  { name: "Matches", fireCost: 10, heatRate: 0.1 },
  { name: "Campfires", fireCost: 100, heatRate: 2 },
  { name: "Stovetops", fireCost: 1000, heatRate: 50 },
  { name: "Pyro", fireCost: 10000, heatRate: 100 },
  { name: "Fireball", fireCost: 100000, heatRate: 1000 },
];

type UpgradeState = {
  purchased: number;
  currentCost: number;
};

const upgradeStates: UpgradeState[] = availableItems.map((item) => ({
  purchased: 0,
  currentCost: item.fireCost,
}));

// DOM Elements
const app: HTMLDivElement = document.querySelector("#app")!;
const header = createHeader();
const flameButton = createFlameButton();
const counter = createCounter();
const statusDisplay = createStatusDisplay();
const growthRateDisplay = createGrowthRateDisplay();

app.append(header, flameButton);
document.body.append(growthRateDisplay, counter, statusDisplay);

// Function Definitions: UI Creation
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

function createStatusDisplay(): HTMLDivElement {
  const statusDisplay = document.createElement("div");
  statusDisplay.id = "status-display";
  statusDisplay.innerText = getStatusDisplayText();
  return statusDisplay;
}

function createGrowthRateDisplay(): HTMLDivElement {
  const growthRateDisplay = document.createElement("div");
  growthRateDisplay.id = "growth-rate-display";
  growthRateDisplay.innerText = `Current Growth Rate: ${growthRate.toFixed(1)}/sec`;
  return growthRateDisplay;
}

// Event Handlers
function handleButtonClick() {
  incrementCounter(1);
}

function handleItemClick(item: Item, index: number) {
  const currentUpgradeState = upgradeStates[index];

  if (count >= currentUpgradeState.currentCost) {
    growthRate += item.heatRate;
    incrementCounter(-currentUpgradeState.currentCost);
    currentUpgradeState.purchased++;
    currentUpgradeState.currentCost *= PRICE_FACTOR;

    updateGrowthRateDisplay();
    updateStatusDisplay();
    itemButtons.forEach((button, i) => {
      button.innerText = `${availableItems[i].name} (${preciseFormat(upgradeStates[i].currentCost)})`;
      updateItemButtonState(button, i);
    });
  }
}

// Utility Functions and Logic
function incrementCounter(amount: number) {
  fractionalCount += amount;
  const integerIncrement = Math.floor(fractionalCount);
  count += integerIncrement;
  fractionalCount -= integerIncrement;
  updateCounterText();
}

function preciseFormat(value: number): string {
  if (value < 1000) {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  }
  return (value / 1000).toFixed(1) + "K";
}

function getCounterText(count: number): string {
  return `You're ${Math.floor(count)} times hotter!`;
}

function getStatusDisplayText(): string {
  let statusText = "Upgrades Bought: ";
  availableItems.forEach((item, index) => {
    statusText += `${item.name}: ${upgradeStates[index].purchased}, `;
  });
  return statusText.slice(0, -2);
}

function updateCounterText() {
  counter.innerText = getCounterText(count);
}

function updateItemButtonState(button: HTMLButtonElement, index: number) {
  const currentUpgradeState = upgradeStates[index];
  const isAvailable = count >= currentUpgradeState.currentCost;
  button.disabled = !isAvailable;
  button.classList.toggle("available", isAvailable);
  button.classList.toggle("unavailable", !isAvailable);
}

function getUpgradeTooltip(name: string): string {
  switch (name) {
    case "Matches":
      return "A quick firestarter!";
    case "Campfires":
      return "Lets make some s'mores!";
    case "Stovetops":
      return "Lets cook something HOT!";
    case "Pyro":
      return "It's like a flamethrower.";
    case "Fireball":
      return "Too hot to handle.";
    default:
      return "Upgrade your fire power!";
  }
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

// Game Loop
function animate(currentTimestamp: number) {
  if (lastTimestamp !== 0) {
    const elapsed = (currentTimestamp - lastTimestamp) / 1000;
    incrementCounter(growthRate * elapsed);
    flameButton.style.transform = `scale(${1 + count * 0.02})`;

    itemButtons.forEach((button, index) =>
      updateItemButtonState(button, index),
    );
  }
  lastTimestamp = currentTimestamp;
  requestAnimationFrame(animate);
}

// Setup Upgrade Buttons
const upgradeContainer = document.createElement("div");
document.body.appendChild(upgradeContainer);

const itemButtons: HTMLButtonElement[] = availableItems.map((item, index) => {
  const button = createItemButton(item, index);
  const row = Math.floor(index / 3);
  let rowDiv = document.getElementById(`upgrade-row-${row}`) as HTMLDivElement;

  if (!rowDiv) {
    rowDiv = document.createElement("div");
    rowDiv.id = `upgrade-row-${row}`;
    rowDiv.style.display = "flex";
    upgradeContainer.appendChild(rowDiv);
  }

  rowDiv.appendChild(button);
  return button;
});

// Start the animation loop
requestAnimationFrame(animate);

// Helper Function for Item Button Creation
function createItemButton(item: Item, index: number): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "upgrade unavailable";
  button.innerText = `${item.name} (${formatNumber(upgradeStates[index].currentCost)})`;
  button.id = `${item.name.toLowerCase()}-button`;
  button.addEventListener("click", () => handleItemClick(item, index));
  updateItemButtonState(button, index);

  const tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = getUpgradeTooltip(item.name);
  button.appendChild(tooltip);

  return button;
}

// Ensure Every Aspect is Covered in Logical Order
function formatNumber(value: number): string {
  return preciseFormat(value);
}
