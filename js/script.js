document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const form = document.querySelector('[ms="wrapper"] > form');
    const prevButton = document.querySelector('[ms-nav="prev"]');
    const nextButton = document.querySelector('[ms-nav="next"]');
    const navContainer = document.querySelector('[ms-nav-steps="container"]');
    const navStepTemplate = document.querySelector('[ms-nav-steps="step"]');
    const navSeparatorTemplate = document.querySelector('[ms-nav-steps="divider"]');

    // Progress Bar Elements
    const progressWrap = document.querySelector('[ms-progress-wrap]');
    const progressBar = document.querySelector('[ms-progress-bar]');
    const currentStepElement = document.querySelector('[ms-current-step]');
    const totalStepsElement = document.querySelector('[ms-total-steps]');

    // Keyboard Navigation Option
    const keyboardNavEnabled = form.hasAttribute('ms-keyboard-nav');

    let currentStep = 0;
    let stepHistory = [];
    let steps = [];
    let filteredSteps = [];

    if (!form || !prevButton || !nextButton) {
      console.error(
        "Required elements not found in the DOM. Please add the ms='wrapper', ms-nav='prev', ms-nav='next' to relevant elements."
      );
      return;
    }

    function filterSteps() {
      steps = Array.from(form.children).filter((step) => {
        return !step.querySelector(
          '[class*="recaptcha"], [class*="h-captcha"], [class*="turnstile"], [class*="captcha"]'
        );
      });

      // Remove step dividers from the live form
      steps = steps.filter((step) => {
        if (step.hasAttribute("ms-step-divider")) {
          step.remove(); // Remove the divider from the live form
          return false;
        }
        return true;
      });

      filteredSteps = getFilteredSteps();
    }

    filterSteps();

    function isVisible(element) {
      return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    function showStep(stepIndex) {
      filterSteps(); // Update filteredSteps based on current conditions

      steps.forEach((step) => {
        step.style.display = "none";
        step.style.opacity = 0;
        step.setAttribute("aria-hidden", "true");
        step.setAttribute("role", "tabpanel");
      });

      if (filteredSteps.length === 0) {
        console.error("No steps are available to display.");
        return;
      }

      if (stepIndex >= filteredSteps.length) {
        stepIndex = filteredSteps.length - 1;
      } else if (stepIndex < 0) {
        stepIndex = 0;
      }

      const currentStepElement = filteredSteps[stepIndex];
      currentStepElement.style.display = "block";
      currentStepElement.setAttribute("aria-hidden", "false");
      setTimeout(() => {
        currentStepElement.style.opacity = 1;
        const firstInput = currentStepElement.querySelector("input, select, textarea");
        if (firstInput) firstInput.focus();
      }, 100);

      updateNavSteps(filteredSteps, stepIndex);
      updateButtons(filteredSteps, stepIndex);
      updateProgressBar(filteredSteps, stepIndex);
      updateRequiredAttributes(filteredSteps);

      currentStep = stepIndex; // Update currentStep to the new index
    }

    function updateNavSteps(filteredSteps, currentStepIndex) {
      if (!navContainer || !navStepTemplate) return;

      navContainer.innerHTML = "";

      const fragment = document.createDocumentFragment();

      filteredSteps.forEach((step, index) => {
        if (index > 0 && navSeparatorTemplate) {
          const separatorClone = navSeparatorTemplate.cloneNode(true);
          separatorClone.removeAttribute("ms-nav-steps-separator");
          fragment.appendChild(separatorClone);
        }

        const stepClone = navStepTemplate.cloneNode(true);
        stepClone.removeAttribute("ms-nav-steps");
        stepClone.textContent = step.getAttribute("ms-step-name") || `Step ${index + 1}`;

        stepClone.classList.toggle("is-active", index === currentStepIndex);
        stepClone.classList.toggle("is-deactive", index > currentStepIndex);

        stepClone.setAttribute("aria-selected", index === currentStepIndex);
        stepClone.setAttribute("role", "tab");
        stepClone.setAttribute("tabindex", index === currentStepIndex ? "0" : "-1");

        if (index <= currentStepIndex) {
          // Only add click event listener to previous steps
          stepClone.addEventListener("click", () => {
            if (index < currentStepIndex) {
              stepHistory.push(currentStep);
              showStep(index);
            }
          });
        } else {
          // Future steps are not clickable
          stepClone.style.pointerEvents = "none";
        }

        fragment.appendChild(stepClone);
      });

      navContainer.appendChild(fragment);
    }

    function updateButtons(filteredSteps, stepIndex) {
      prevButton.style.display = stepIndex === 0 ? "none" : "inline-block";
      const isLastStep = stepIndex === filteredSteps.length - 1;
      nextButton.style.display = isLastStep ? "none" : "inline-block";
      prevButton.setAttribute("aria-disabled", stepIndex === 0);
      nextButton.setAttribute("aria-disabled", isLastStep);

      // Handle submit buttons dynamically
      const submitButtons = form.querySelectorAll('[type="submit"]');
      submitButtons.forEach((submitButton) => {
        submitButton.style.display = isLastStep ? "inline-block" : "none";
      });
    }

    function updateProgressBar(filteredSteps, stepIndex) {
      const totalSteps = filteredSteps.length;
      const currentStepNumber = stepIndex + 1;
      const progressPercentage = ((currentStepNumber - 1) / (totalSteps - 1)) * 100;

      if (progressBar) {
        progressBar.style.width = progressPercentage + "%";
      }

      if (currentStepElement) {
        currentStepElement.textContent = currentStepNumber;
      }

      if (totalStepsElement) {
        totalStepsElement.textContent = totalSteps;
      }
    }

    function validateStep(stepIndex) {
      const step = filteredSteps[stepIndex];
      if (!step) return true; // No step to validate
      const inputs = step.querySelectorAll("input, select, textarea");
      for (let input of inputs) {
        if (isVisible(input) && !input.checkValidity()) {
          input.reportValidity();
          return false;
        }
      }
      return true;
    }

    function validateAllVisibleSteps() {
      for (let i = 0; i < filteredSteps.length; i++) {
        if (!validateStep(i)) {
          return false;
        }
      }
      return true;
    }

    function findFirstInvalidStep(targetStepIndex) {
      for (let i = 0; i <= targetStepIndex; i++) {
        if (!validateStep(i)) {
          return i;
        }
      }
      return null;
    }

    function getFilteredSteps() {
      return steps.filter((step) => {
        const condition = step.getAttribute("data-condition");
        if (condition) {
          return evaluateCondition(condition);
        }
        return true;
      });
    }

    function evaluateCondition(condition) {
      // Enhanced condition evaluator
      // Supports operators: ==, !=, ===, !==, <, <=, >, >=
      const conditionMatch = condition.match(/(\w+)\s*(==|!=|===|!==|<=|>=|<|>)\s*'([^']*)'/);
      if (conditionMatch) {
        const [, inputName, operator, value] = conditionMatch;
        let inputValue = null;

        // Handle radio buttons and checkboxes
        const inputs = form.querySelectorAll(`[name="${inputName}"]`);
        if (inputs.length > 1) {
          // It's a group of radio buttons or checkboxes
          const checkedInput = form.querySelector(`[name="${inputName}"]:checked`);
          inputValue = checkedInput ? checkedInput.value : '';
        } else {
          const input = inputs[0];
          if (input) {
            if (input.type === 'checkbox') {
              inputValue = input.checked ? input.value || 'on' : '';
            } else {
              inputValue = input.value;
            }
          }
        }

        if (inputValue !== null) {
          let compareValue = value;

          // Attempt to parse values as numbers for numeric comparisons
          const numericInputValue = parseFloat(inputValue);
          const numericCompareValue = parseFloat(compareValue);
          const areNumeric = !isNaN(numericInputValue) && !isNaN(numericCompareValue);

          switch (operator) {
            case "==":
              return inputValue == compareValue;
            case "!=":
              return inputValue != compareValue;
            case "===":
              return inputValue === compareValue;
            case "!==":
              return inputValue !== compareValue;
            case "<":
              return areNumeric ? numericInputValue < numericCompareValue : false;
            case "<=":
              return areNumeric ? numericInputValue <= numericCompareValue : false;
            case ">":
              return areNumeric ? numericInputValue > numericCompareValue : false;
            case ">=":
              return areNumeric ? numericInputValue >= numericCompareValue : false;
            default:
              return false;
          }
        }
      }
      return false;
    }

    function updateRequiredAttributes(filteredSteps) {
      steps.forEach((step) => {
        const inputs = step.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          if (input.hasAttribute("required") && !filteredSteps.includes(step)) {
            input.setAttribute("data-required", "true");
            input.removeAttribute("required");
          } else if (
            !input.hasAttribute("required") &&
            filteredSteps.includes(step) &&
            input.getAttribute("data-required") === "true"
          ) {
            input.setAttribute("required", "true");
            input.removeAttribute("data-required");
          }
        });
      });
    }

    function handlePrevClick() {
      if (stepHistory.length > 0) {
        const prevStepIndex = stepHistory.pop();
        showStep(prevStepIndex);
      } else if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    }

    function handleNextClick() {
      if (validateStep(currentStep)) {
        if (currentStep < filteredSteps.length - 1) {
          stepHistory.push(currentStep);
          showStep(currentStep + 1);
        }
      }
    }

    function setupNavigationListeners() {
      prevButton.addEventListener("click", handlePrevClick);
      nextButton.addEventListener("click", handleNextClick);
    }

    function handleFormSubmit(event) {
      filterSteps(); // Ensure filteredSteps is updated
      const hiddenRequiredInputs = form.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );
      hiddenRequiredInputs.forEach((input) => {
        if (!isVisible(input)) {
          input.dataset.originalRequired = "true";
          input.removeAttribute("required");
        }
      });

      if (!validateAllVisibleSteps()) {
        event.preventDefault();
        for (let i = 0; i < filteredSteps.length; i++) {
          if (!validateStep(i)) {
            showStep(i);
            validateStep(i); // Show validation messages
            break;
          }
        }

        hiddenRequiredInputs.forEach((input) => {
          if (input.dataset.originalRequired) {
            input.setAttribute("required", "true");
            delete input.dataset.originalRequired;
          }
        });
      } else {
        hiddenRequiredInputs.forEach((input) => {
          if (input.dataset.originalRequired) {
            input.setAttribute("required", "true");
            delete input.dataset.originalRequired;
          }
        });
      }
    }

    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    const debouncedFilterSteps = debounce(() => {
      filterSteps();
      if (!filteredSteps.includes(steps[currentStep])) {
        if (currentStep >= filteredSteps.length) {
          currentStep = filteredSteps.length - 1;
        }
        showStep(currentStep);
      } else {
        updateNavSteps(filteredSteps, currentStep);
        updateButtons(filteredSteps, currentStep);
        updateProgressBar(filteredSteps, currentStep);
        updateRequiredAttributes(filteredSteps);
      }
    }, 100);

    const observer = new MutationObserver(debouncedFilterSteps);

    observer.observe(form, {
      childList: true,
      subtree: true,
    });

    function setupConditionalListeners() {
      const allInputs = form.querySelectorAll("input, select, textarea");
      allInputs.forEach((input) => {
        input.addEventListener("change", debouncedFilterSteps);
      });
    }

    function handleKeyDown(event) {
      if (!keyboardNavEnabled) return;

      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === "TEXTAREA") return; // Ignore in textareas

      if (event.key === "Enter") {
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
          // Ctrl+Enter or Cmd+Enter to submit
          if (currentStep === filteredSteps.length - 1) {
            form.submit();
          }
        } else {
          // Enter to go to next step
          handleNextClick();
        }
      }
    }

    function setupKeyboardNavigation() {
      if (keyboardNavEnabled) {
        form.addEventListener("keydown", handleKeyDown);
      }
    }

    (function initializeMultiStepForm() {
      setupNavigationListeners();
      setupConditionalListeners();
      setupKeyboardNavigation();
      form.addEventListener("submit", handleFormSubmit);
      showStep(0);
      document.querySelector('[ms="wrapper"]').style.cssText = "display: block; opacity: 1";

      // Initialize progress bar on load
      updateProgressBar(filteredSteps, currentStep);
    })();

    window.multiStepFormAPI = {
      setStep(stepIndex) {
        if (stepIndex <= currentStep) {
          // Allow navigating to previous steps
          stepHistory.push(currentStep);
          showStep(stepIndex);
        }
      },
      getCurrentStep() {
        return currentStep;
      },
      validateCurrentStep() {
        return validateStep(currentStep);
      },
      nextStep() {
        handleNextClick();
      },
      prevStep() {
        handlePrevClick();
      },
    };

    console.log("MultiStep forms v2.0.5 initialized successfully!");
  })();
});
