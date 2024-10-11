/* Reformatted using Brace for more cohesive legibility */

import "./style.css";

// constants
const GAME_NAME = "That's Hot";
document.title = GAME_NAME;

const GROWTH_RATE_PER_SECOND = 1; // units per second

// DOM Elements
const app: HTMLDivElement = document.querySelector("#app")!;
const header = createHeader();
const button = createButton();
const counter = createCounter();
let count = 0;

let lastTimestamp = 0;
let fractionalCount = 0;  // keeps track of fractional increments

// functions
function createHeader(): HTMLHeadingElement {
  const header = document.createElement("h1");
  header.innerHTML = GAME_NAME;
  return header;
}

function createButton(): HTMLButtonElement {
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

function handleButtonClick() {
  incrementCounter(1);  // increase by 1 on a click
  alert("You're on fire!");
}

function incrementCounter(amount: number) {
  fractionalCount += amount;
  const integerIncrement = Math.floor(fractionalCount);
  count += integerIncrement;
  fractionalCount -= integerIncrement;  // keeps the fractional remainder
  updateCounterText();
}

function getCounterText(count: number): string {
  return `You're ${count} times hotter!`;
}

function updateCounterText() {
  counter.innerText = getCounterText(count);
}

function animate(currentTimestamp: number) {
  if (lastTimestamp !== 0) {
    // calculate time elapsed since last frame
    const elapsed = (currentTimestamp - lastTimestamp) / 1000;

    // increment fractional count based on elapsed time and growth rate
    incrementCounter(GROWTH_RATE_PER_SECOND * elapsed);
    
    // grow the button icon
    button.style.transform = `scale(${1 + (count * 0.02)})`;
  }
  lastTimestamp = currentTimestamp;

  requestAnimationFrame(animate);
}

// initial Setup
app.append(header, button);
document.body.appendChild(counter);

// start the animation loop
requestAnimationFrame(animate);