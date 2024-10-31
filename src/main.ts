import "./style.css";
import items from "./items.json"; // Importing the items from the JSON file

// Constants
const GAME_TITLE = "That's Hot";
document.title = GAME_TITLE;

const FIRE_COST_MULTIPLIER = 1.15;

// Initial State
let currentHeatCount = 0;
let lastAnimationTimestamp = 0;
let fractionalHeatCount = 0;
let heatGrowthRate = 0;

// Define the interface for your items
interface UpgradeItem {
  name: string;
  fireCost: number;
  heatRate: number;
}

// Use the imported items directly
const availableUpgradeItems: UpgradeItem[] = items;

type UpgradeStatus = {
  purchasedCount: number;
  currentPurchaseCost: number;
};

const upgradeStatuses: UpgradeStatus[] = availableUpgradeItems.map((item) => ({
  purchasedCount: 0,
  currentPurchaseCost: item.fireCost,
}));

// DOM Elements and Initialization
const appContainer: HTMLDivElement = document.querySelector("#app")!;
const gameHeader = createGameHeader();
const fireButton = createFireButton();
const heatCounterDisplay = createHeatCounterDisplay();
const upgradeStatusDisplay = createUpgradeStatusDisplay();
const heatGrowthDisplay = createHeatGrowthDisplay();

appContainer.append(gameHeader, fireButton);
document.body.append(
  heatGrowthDisplay,
  heatCounterDisplay,
  upgradeStatusDisplay,
);

// Function Definitions: UI Creation
function createGameHeader(): HTMLHeadingElement {
  const header = document.createElement("h1");
  header.innerHTML = GAME_TITLE;
  return header;
}

function createFireButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerText = "🔥";
  button.addEventListener("click", onFireButtonClick);
  return button;
}

function createHeatCounterDisplay(): HTMLDivElement {
  const counter = document.createElement("div");
  counter.id = "counter";
  counter.innerText = getHeatCounterText(0);
  return counter;
}

function createUpgradeStatusDisplay(): HTMLDivElement {
  const statusDisplay = document.createElement("div");
  statusDisplay.id = "status-display";
  statusDisplay.innerText = getUpgradeStatusText();
  return statusDisplay;
}

function createHeatGrowthDisplay(): HTMLDivElement {
  const growthRateDisplay = document.createElement("div");
  growthRateDisplay.id = "growth-rate-display";
  growthRateDisplay.innerText = `Current Growth Rate: ${heatGrowthRate.toFixed(1)}/sec`;
  return growthRateDisplay;
}

// Event Handlers
function onFireButtonClick() {
  adjustHeatCount(1);
}

function handleUpgradeItemClick(item: UpgradeItem, index: number) {
  const status = upgradeStatuses[index];

  if (currentHeatCount >= status.currentPurchaseCost) {
    heatGrowthRate += item.heatRate;
    adjustHeatCount(-status.currentPurchaseCost);
    status.purchasedCount++;
    status.currentPurchaseCost *= FIRE_COST_MULTIPLIER;

    updateHeatGrowthDisplay();
    updateUpgradeStatusDisplay();
    itemButtons.forEach((button, i) => {
      button.innerText = `${availableUpgradeItems[i].name} (${formatCost(upgradeStatuses[i].currentPurchaseCost)})`;
      updateUpgradeButtonState(button, i);
    });
  }
}

// Utility Functions and Logic
function adjustHeatCount(amount: number) {
  fractionalHeatCount += amount;
  const integerIncrement = Math.floor(fractionalHeatCount);
  currentHeatCount += integerIncrement;
  fractionalHeatCount -= integerIncrement;
  updateHeatCounterText();
}

function formatCost(value: number): string {
  // Combined into a single function
  if (value < 1000) {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  }
  return (value / 1000).toFixed(1) + "K";
}

function getHeatCounterText(heatCount: number): string {
  return `You're ${Math.floor(heatCount)} times hotter!`;
}

function getUpgradeStatusText(): string {
  let statusText = "Upgrades Bought: ";
  availableUpgradeItems.forEach((item, index) => {
    statusText += `${item.name}: ${upgradeStatuses[index].purchasedCount}, `;
  });
  return statusText.slice(0, -2);
}

function updateHeatCounterText() {
  heatCounterDisplay.innerText = getHeatCounterText(currentHeatCount);
}

function updateUpgradeButtonState(button: HTMLButtonElement, index: number) {
  const status = upgradeStatuses[index];
  const isAvailable = currentHeatCount >= status.currentPurchaseCost;
  button.disabled = !isAvailable;
  button.classList.toggle("available", isAvailable);
  button.classList.toggle("unavailable", !isAvailable);
}

function getUpgradeTooltip(name: string): string {
  switch (name) {
    case "Matches":
      return "A quick firestarter!";
    case "Campfires":
      return "Let's make some s'mores!";
    case "Stovetops":
      return "Let's cook something HOT!";
    case "Pyro":
      return "It's like a flamethrower.";
    case "Fireball":
      return "Too hot to handle.";
    default:
      return "Upgrade your fire power!";
  }
}

function updateHeatGrowthDisplay() {
  const growthRateElement = document.getElementById("growth-rate-display");
  if (growthRateElement) {
    growthRateElement.innerText = `Current Growth Rate: ${heatGrowthRate.toFixed(1)}/sec`;
  }
}

function updateUpgradeStatusDisplay() {
  const statusElement = document.getElementById("status-display");
  if (statusElement) {
    statusElement.innerText = getUpgradeStatusText();
  }
}

// Game Loop
function animateGameLoop(currentTimestamp: number) {
  if (lastAnimationTimestamp !== 0) {
    const elapsed = (currentTimestamp - lastAnimationTimestamp) / 1000;
    adjustHeatCount(heatGrowthRate * elapsed);
    fireButton.style.transform = `scale(${1 + currentHeatCount * 0.02})`;

    itemButtons.forEach((button, index) =>
      updateUpgradeButtonState(button, index),
    );
  }
  lastAnimationTimestamp = currentTimestamp;
  requestAnimationFrame(animateGameLoop);
}

// Setup Upgrade Buttons
const upgradeContainer = document.createElement("div");
document.body.appendChild(upgradeContainer);

const itemButtons: HTMLButtonElement[] = availableUpgradeItems.map(
  (item, index) => {
    const button = createUpgradeButton(item, index);
    const row = Math.floor(index / 3);
    let rowDiv = document.getElementById(
      `upgrade-row-${row}`,
    ) as HTMLDivElement;

    if (!rowDiv) {
      rowDiv = document.createElement("div");
      rowDiv.id = `upgrade-row-${row}`;
      rowDiv.style.display = "flex";
      upgradeContainer.appendChild(rowDiv);
    }

    rowDiv.appendChild(button);
    return button;
  },
);

// Start the animation loop
requestAnimationFrame(animateGameLoop);

// Helper Function for Upgrade Button Creation
function createUpgradeButton(
  item: UpgradeItem,
  index: number,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "upgrade unavailable";
  button.innerText = `${item.name} (${formatCost(upgradeStatuses[index].currentPurchaseCost)})`;
  button.id = `${item.name.toLowerCase()}-button`;
  button.addEventListener("click", () => handleUpgradeItemClick(item, index));
  updateUpgradeButtonState(button, index);

  const tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = getUpgradeTooltip(item.name);
  button.appendChild(tooltip);

  return button;
}
