const state = {
  dividend: 0,
  divisor: 0,
  quotient: 0,
  remainder: 0,
  digits: [],
  steps: [],
  currentStepIndex: 0,
  solvedSteps: [],
  phase: "idle",
  selectedDividendIndices: [],
};

const elements = {
  divisorDigits: document.getElementById("divisor-digits"),
  newDivisionBtn: document.getElementById("new-division-btn"),
  checkBtn: document.getElementById("check-btn"),
  dividendContainer: document.getElementById("dividend-container"),
  divisorDisplay: document.getElementById("divisor-display"),
  quotientBoxes: document.getElementById("quotient-boxes"),
  subtractionArea: document.getElementById("subtraction-area"),
  currentStepCard: document.getElementById("current-step-card"),
  stepsContainer: document.getElementById("steps-container"),
  hintText: document.getElementById("hint-text"),
  multiplyDisplay: document.getElementById("multiply-display"),
  remainderDisplay: document.getElementById("remainder-display"),
  builtQuotientDisplay: document.getElementById("built-quotient-display"),
  currentRemainderDisplay: document.getElementById("current-remainder-display"),
  resultMessage: document.getElementById("result-message"),
  paper: document.querySelector(".paper"),
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function digitTokens(value) {
  return String(value).split("");
}

function buildSteps(dividend, divisor) {
  const digits = digitTokens(dividend).map(Number);
  const steps = [];
  let partial = 0;
  let started = false;
  let firstSelection = [];

  digits.forEach((digit, index) => {
    partial = partial * 10 + digit;

    if (!started) {
      firstSelection.push(index);
    }

    if (!started && partial < divisor && index < digits.length - 1) {
      return;
    }

    const quotientDigit = Math.floor(partial / divisor);
    const product = quotientDigit * divisor;
    const remainder = partial - product;

    steps.push({
      partial,
      quotientDigit,
      product,
      remainder,
      selectionIndices: started ? [index] : [...firstSelection],
      sourceDigitIndex: index,
      nextDigitIndex: index < digits.length - 1 ? index + 1 : null,
    });

    started = true;
    partial = remainder;
  });

  return steps;
}

function getBuiltQuotient() {
  return state.solvedSteps.map((step) => step.quotientDigit).join("");
}

function getCurrentRemainder() {
  if (state.solvedSteps.length === 0) {
    return "";
  }

  return String(state.solvedSteps[state.solvedSteps.length - 1].remainder);
}

function getSelectableIndices() {
  if (state.currentStepIndex >= state.steps.length) {
    return [];
  }

  return state.steps[state.currentStepIndex].selectionIndices;
}

function renderDividend() {
  const selectable = getSelectableIndices();

  elements.dividendContainer.innerHTML = state.digits
    .map((digit, index) => {
      const isSolved = state.solvedSteps.some((step) => step.selectionIndices.includes(index));
      const isSelectable = selectable.includes(index);
      const isSelected = state.selectedDividendIndices.includes(index);

      let className = "digit-btn";

      if (isSelected) {
        className += " selected";
      } else if (state.phase === "choose-quotient" && isSelectable) {
        className += " selected";
      } else if (isSelectable) {
        className += state.phase === "bring-down" ? " lowering" : " available";
      } else if (isSolved) {
        className += " locked";
      }

      return `<button type="button" class="${className}" data-digit-index="${index}">${digit}</button>`;
    })
    .join("");

  elements.dividendContainer.querySelectorAll("[data-digit-index]").forEach((button) => {
    button.addEventListener("click", () => handleDigitSelection(Number(button.dataset.digitIndex)));
  });
}

function renderQuotientBoxes() {
  const builtDigits = getBuiltQuotient().split("");
  const totalSlots = String(state.quotient).length;

  elements.quotientBoxes.innerHTML = Array.from({ length: totalSlots }, (_, index) => {
    const value = builtDigits[index] || "";
    const filledClass = value ? " filled" : "";
    return `<div class="quotient-slot${filledClass}">${value}</div>`;
  }).join("");
}

function renderSubtractionArea() {
  const lastSolved = state.solvedSteps[state.solvedSteps.length - 1];

  if (!lastSolved) {
    elements.subtractionArea.innerHTML = `
      <div class="subtraction-box empty">
        Aqui aparecera la resta exacta de cada paso.
      </div>
    `;
    return;
  }

  const partialDigits = digitTokens(lastSolved.partial);
  const productDigits = digitTokens(lastSolved.product);
  const remainderDigits = digitTokens(lastSolved.remainder);

  elements.subtractionArea.innerHTML = `
    <div class="subtraction-box">
      <div class="subtraction-row">
        ${partialDigits.map((digit) => `<span class="static-digit">${digit}</span>`).join("")}
      </div>
      <div class="subtraction-row line">
        <span class="subtraction-sign">-</span>
        ${productDigits.map((digit) => `<span class="static-digit">${digit}</span>`).join("")}
      </div>
      <div class="subtraction-row">
        ${remainderDigits.map((digit) => `<span class="lowered-digit">${digit}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderStepsHistory() {
  if (state.solvedSteps.length === 0) {
    elements.stepsContainer.innerHTML = `
      <div class="step-card">
        <strong>Pasos resueltos</strong>
        <p>Aun no hay pasos terminados.</p>
      </div>
    `;
    return;
  }

  elements.stepsContainer.innerHTML = state.solvedSteps
    .map((step, index) => {
      return `
        <div class="step-card solved">
          <strong>Paso ${index + 1}</strong>
          <p class="step-summary">
            <strong>${step.partial}</strong> / ${state.divisor} = ${step.quotientDigit}
          </p>
          <p>${step.partial} - ${step.product} = ${step.remainder}</p>
        </div>
      `;
    })
    .join("");
}

function renderCurrentStepCard() {
  if (state.currentStepIndex >= state.steps.length) {
    elements.currentStepCard.innerHTML = `
      <h3>Division terminada</h3>
      <p>Las cifras del cociente ya estan colocadas y la resta final esta hecha.</p>
      <p>Pulsa "Verificar" para comprobarlo.</p>
    `;
    return;
  }

  const step = state.steps[state.currentStepIndex];

  if (state.phase === "select-start") {
    elements.currentStepCard.innerHTML = `
      <h3>Paso ${state.currentStepIndex + 1}</h3>
      <p>Pulsa las cifras del dividendo que forman el primer numero con el que si se puede dividir.</p>
      <p>Debes seleccionar ${step.selectionIndices.length} cifra(s).</p>
    `;
    return;
  }

  if (state.phase === "bring-down") {
    elements.currentStepCard.innerHTML = `
      <h3>Paso ${state.currentStepIndex + 1}</h3>
      <p>Ahora baja la siguiente cifra del dividendo pulsando sobre ella.</p>
      <p>Con esa bajada trabajaras con <strong>${step.partial}</strong>.</p>
    `;
    return;
  }

  const correctDigit = step.quotientDigit;

  elements.currentStepCard.innerHTML = `
    <h3>Paso ${state.currentStepIndex + 1}</h3>
    <p>Estamos trabajando con <strong>${step.partial}</strong>.</p>
    <p>Elige la cifra que va en el cociente bajo el divisor.</p>
    <div class="choice-grid">
      ${Array.from({ length: 10 }, (_, value) => {
        return `<button type="button" class="choice-btn" data-choice="${value}">${value}</button>`;
      }).join("")}
    </div>
  `;

  elements.currentStepCard.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => solveCurrentStep(Number(button.dataset.choice)));
  });
}

function updateSidePanel() {
  const builtQuotient = getBuiltQuotient();
  const currentRemainder = getCurrentRemainder();

  elements.builtQuotientDisplay.textContent = builtQuotient || "Todavia no hay cifras";
  elements.currentRemainderDisplay.textContent = currentRemainder === "" ? "Todavia no hay resto" : currentRemainder;
}

function renderBoard() {
  renderDividend();
  renderQuotientBoxes();
  renderSubtractionArea();
  renderCurrentStepCard();
  renderStepsHistory();
  updateSidePanel();
}

function resetFeedback() {
  elements.multiplyDisplay.textContent = "Cociente x Divisor";
  elements.remainderDisplay.textContent = "+ Resto";
  elements.resultMessage.textContent = "Resuelve la division paso a paso y luego verifica.";
  elements.resultMessage.className = "result-message";
}

function updateHelp(message) {
  elements.hintText.textContent = `💡 Pista: ${message}`;
}

function setPhaseForCurrentStep() {
  if (state.currentStepIndex >= state.steps.length) {
    state.phase = "finished";
    return;
  }

  state.phase = state.currentStepIndex === 0 ? "select-start" : "bring-down";
  state.selectedDividendIndices = [];
}

function generateNewDivision() {
  const digits = Number(elements.divisorDigits.value);
  const divisorMin = digits === 1 ? 2 : 10 ** (digits - 1);
  const divisorMax = 10 ** digits - 1;

  state.divisor = randomInt(divisorMin, divisorMax);
  state.quotient = randomInt(2, 99);
  state.remainder = randomInt(0, state.divisor - 1);
  state.dividend = state.divisor * state.quotient + state.remainder;
  state.digits = digitTokens(state.dividend);
  state.steps = buildSteps(state.dividend, state.divisor);
  state.currentStepIndex = 0;
  state.solvedSteps = [];

  elements.divisorDisplay.textContent = state.divisor;
  resetFeedback();
  setPhaseForCurrentStep();
  renderBoard();
  updateHelp("Empieza pulsando las cifras iniciales del dividendo que vas a usar.");
  elements.paper.style.borderColor = "#d1d9e6";
}

function handleDigitSelection(index) {
  if (state.currentStepIndex >= state.steps.length) {
    return;
  }

  const expectedIndices = state.steps[state.currentStepIndex].selectionIndices;

  if (!expectedIndices.includes(index)) {
    updateHelp("Esa cifra no toca en este momento. Fijate en el paso actual.");
    return;
  }

  if (state.phase === "select-start") {
    const nextExpected = expectedIndices[state.selectedDividendIndices.length];

    if (index !== nextExpected) {
      updateHelp("Pulsa las cifras en el orden en que se leen en el dividendo.");
      return;
    }

    if (!state.selectedDividendIndices.includes(index)) {
      state.selectedDividendIndices.push(index);
    }

    if (state.selectedDividendIndices.length === expectedIndices.length) {
      state.phase = "choose-quotient";
      updateHelp(`Muy bien. Ahora elige cuantas veces cabe ${state.divisor} en ${state.steps[state.currentStepIndex].partial}.`);
    } else {
      updateHelp("Bien. Sigue pulsando la siguiente cifra que tambien forma parte del numero elegido.");
    }

    renderBoard();
    return;
  }

  if (state.phase === "bring-down") {
    state.selectedDividendIndices = [index];
    state.phase = "choose-quotient";
    updateHelp(`Perfecto. Ya has bajado la cifra. Ahora elige la cifra del cociente para ${state.steps[state.currentStepIndex].partial}.`);
    renderBoard();
  }
}

function solveCurrentStep(selectedDigit) {
  if (state.phase !== "choose-quotient") {
    return;
  }

  const expected = state.steps[state.currentStepIndex];

  if (selectedDigit !== expected.quotientDigit) {
    updateHelp(`No es esa. Piensa cuantas veces cabe ${state.divisor} en ${expected.partial} sin pasarte.`);
    return;
  }

  state.solvedSteps.push(expected);
  state.currentStepIndex += 1;
  setPhaseForCurrentStep();

  if (state.currentStepIndex < state.steps.length) {
    const nextStep = state.steps[state.currentStepIndex];

    if (state.phase === "bring-down") {
      updateHelp(`Correcto. Ahora baja la siguiente cifra para formar ${nextStep.partial}.`);
    } else {
      updateHelp(`Correcto. Sigue con el siguiente paso usando ${nextStep.partial}.`);
    }
  } else {
    updateHelp("Has completado todos los pasos. Ya puedes verificar la division.");
  }

  renderBoard();
}

function verifyDivision() {
  if (state.solvedSteps.length !== state.steps.length) {
    elements.resultMessage.textContent = "Primero termina todos los pasos de la division.";
    elements.resultMessage.className = "result-message error";
    return;
  }

  const userQuotient = Number(getBuiltQuotient());
  const userRemainder = Number(getCurrentRemainder());
  const product = userQuotient * state.divisor;
  const rebuiltDividend = product + userRemainder;

  elements.multiplyDisplay.textContent = `${userQuotient} x ${state.divisor} = ${product}`;
  elements.remainderDisplay.textContent = `${product} + ${userRemainder} = ${rebuiltDividend}`;

  if (userQuotient === state.quotient && userRemainder === state.remainder) {
    elements.resultMessage.textContent = `Correcto. ${state.dividend} / ${state.divisor} = ${state.quotient} y sobra ${state.remainder}.`;
    elements.resultMessage.className = "result-message success";
    elements.paper.style.borderColor = "#48bb78";
    return;
  }

  elements.resultMessage.textContent = "Algo no coincide con la division generada. Revisa los pasos.";
  elements.resultMessage.className = "result-message error";
}

elements.newDivisionBtn.addEventListener("click", generateNewDivision);
elements.checkBtn.addEventListener("click", verifyDivision);

document.addEventListener("DOMContentLoaded", generateNewDivision);
