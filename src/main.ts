import "./style.css";

// constants
const GAME_NAME = "That's Hot";
document.title = GAME_NAME;

//const INCREMENT_INTERVAL_MS = 1000;
const UPGRADE_COST = 10;

// DOM Elements
const app: HTMLDivElement = document.querySelector("#app")!;
const header = createHeader();
const flameButton = createFlameButton();
const counter = createCounter();
const upgradeButton = createUpgradeButton();
let count = 0;
let lastTimestamp = 0;
let fractionalCount = 0;
let growthRate = 0;

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

function createUpgradeButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerText = "Light a Spark (10)";
  button.disabled = true;
  button.style.opacity = "0.5";
  button.id = "upgrade-button";
  button.addEventListener("click", handleUpgradeClick);
  return button;
}

function handleButtonClick() {
  incrementCounter(1);
}

function handleUpgradeClick() {
  if (count >= UPGRADE_COST) {
    growthRate += 1; // increase growth rate
    incrementCounter(-UPGRADE_COST); // deduct from the current count
    updateUpgradeButtonState(); // update button state
  }
}

function incrementCounter(amount: number) {
  fractionalCount += amount;
  const integerIncrement = Math.floor(fractionalCount);
  count += integerIncrement;
  fractionalCount -= integerIncrement; // keep the fractional remainder
  updateCounterText();
}

function getCounterText(count: number): string {
  return `You're ${Math.floor(count)} times hotter!`;
}

function updateCounterText() {
  counter.innerText = getCounterText(count);
}

function updateUpgradeButtonState() {
  // enable button only if the player has enough
  upgradeButton.disabled = count < UPGRADE_COST;
  upgradeButton.style.opacity = count < UPGRADE_COST ? "0.5" : "1.0";
}

function animate(currentTimestamp: number) {
  if (lastTimestamp !== 0) {
    // calculate time elapsed since last frame
    const elapsed = (currentTimestamp - lastTimestamp) / 1000;

    // increment fractional count based on elapsed time and growth rate
    incrementCounter(growthRate * elapsed);

    // grow the button icon
    flameButton.style.transform = `scale(${1 + count * 0.02})`;

    // update upgrade button state
    updateUpgradeButtonState();
  }
  lastTimestamp = currentTimestamp;

  requestAnimationFrame(animate);
}

// Initial Setup
app.append(header, flameButton);
document.body.appendChild(counter);
document.body.appendChild(upgradeButton);

// Start the animation loop
requestAnimationFrame(animate);
