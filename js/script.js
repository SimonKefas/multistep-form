document.addEventListener("DOMContentLoaded", function () {
  (function () {
    class MultiStepForm {
      constructor(wrapper) {
        this.wrapper = wrapper;
        this.form = wrapper.querySelector('form');
        // Global navigation buttons are optional; if not found, they won't be used.
        this.prevButton = wrapper.querySelector('[ms-nav="prev"]');
        this.nextButton = wrapper.querySelector('[ms-nav="next"]');
        this.navContainer = wrapper.querySelector('[ms-nav-steps="container"]');
        this.navStepTemplate = wrapper.querySelector('[ms-nav-steps="step"]');
        this.navSeparatorTemplate = wrapper.querySelector('[ms-nav-steps="divider"]');
        this.progressWrap = wrapper.querySelector('[ms-progress-wrap]');
        this.progressBar = wrapper.querySelector('[ms-progress-bar]');
        this.currentStepElement = wrapper.querySelector('[ms-current-step]');
        this.totalStepsElement = wrapper.querySelector('[ms-total-steps]');

        // Keyboard Navigation Option
        this.keyboardNavEnabled = this.form.hasAttribute('ms-keyboard-nav');
        this.nextKeyCombo = this.form.getAttribute('data-next-key') || 'Shift+Enter';
        this.prevKeyCombo = this.form.getAttribute('data-prev-key') || 'Alt+Enter';

        this.currentStep = 0;
        this.stepHistory = [];
        this.steps = [];
        this.filteredSteps = [];

        if (!this.form) {
          console.error("Form not found in multistep form wrapper.");
          return;
        }

        this.initialize();
      }

      initialize() {
        // Remove elements with 'ms-step-divider' attribute
        const stepDividers = this.form.querySelectorAll('[ms-step-divider]');
        stepDividers.forEach((divider) => divider.remove());

        this.filterSteps();
        this.setupNavigationListeners();
        this.setupConditionalListeners();
        this.setupKeyboardNavigation();
        this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
        this.showStep(0, false); // No autofocus on initial load
        this.wrapper.style.cssText = "display: block; opacity: 1";

        // Initialize progress bar on load
        this.updateProgressBar(this.filteredSteps, this.currentStep);
      }

      filterSteps() {
        // Select only elements with the 'ms-step' attribute within the form
        this.steps = Array.from(this.form.querySelectorAll('[ms-step]'));
        this.filteredSteps = this.getFilteredSteps();
      }

      isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      }

      showStep(stepIndex, shouldFocus = false) {
        this.filterSteps(); // Update filteredSteps based on current conditions

        this.steps.forEach((step) => {
          step.style.display = "none";
          step.style.opacity = 0;
          step.setAttribute("aria-hidden", "true");
          step.setAttribute("role", "tabpanel");
        });

        if (this.filteredSteps.length === 0) {
          console.error("No steps are available to display.");
          return;
        }

        if (stepIndex >= this.filteredSteps.length) {
          stepIndex = this.filteredSteps.length - 1;
        } else if (stepIndex < 0) {
          stepIndex = 0;
        }

        const currentStepElement = this.filteredSteps[stepIndex];
        currentStepElement.style.display = "block";
        currentStepElement.setAttribute("aria-hidden", "false");
        setTimeout(() => {
          currentStepElement.style.opacity = 1;
          if (shouldFocus) {
            const firstInput = currentStepElement.querySelector("input, select, textarea");
            if (firstInput) firstInput.focus();
          }
        }, 100);

        this.updateNavSteps(this.filteredSteps, stepIndex);
        this.updateButtons(this.filteredSteps, stepIndex);
        this.updateProgressBar(this.filteredSteps, stepIndex);
        this.updateRequiredAttributes(this.filteredSteps);

        this.currentStep = stepIndex;
      }

      updateNavSteps(filteredSteps, currentStepIndex) {
        if (!this.navContainer || !this.navStepTemplate) return;

        this.navContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();

        filteredSteps.forEach((step, index) => {
          if (index > 0 && this.navSeparatorTemplate) {
            const separatorClone = this.navSeparatorTemplate.cloneNode(true);
            separatorClone.removeAttribute("ms-nav-steps-separator");
            fragment.appendChild(separatorClone);
          }

          const stepClone = this.navStepTemplate.cloneNode(true);
          stepClone.removeAttribute("ms-nav-steps");
          // Use ms-step-name if defined; else, use the value of ms-step; else, leave empty
          const stepName = step.getAttribute("ms-step-name") || step.getAttribute("ms-step") || "";
          stepClone.textContent = stepName;

          stepClone.classList.toggle("is-active", index === currentStepIndex);
          stepClone.classList.toggle("is-deactive", index > currentStepIndex);
          stepClone.setAttribute("aria-selected", index === currentStepIndex);
          stepClone.setAttribute("role", "tab");
          stepClone.setAttribute("tabindex", index === currentStepIndex ? "0" : "-1");

          if (index <= currentStepIndex) {
            stepClone.addEventListener("click", () => {
              if (index < currentStepIndex) {
                this.stepHistory.push(this.currentStep);
                this.showStep(index, false);
              }
            });
          } else {
            stepClone.style.pointerEvents = "none";
          }

          fragment.appendChild(stepClone);
        });

        this.navContainer.appendChild(fragment);
      }

      updateButtons(filteredSteps, stepIndex) {
        if (this.prevButton) {
          this.prevButton.style.display = stepIndex === 0 ? "none" : "inline-block";
          this.prevButton.setAttribute("aria-disabled", stepIndex === 0);
        }
        if (this.nextButton) {
          const isLastStep = (stepIndex === filteredSteps.length - 1);
          if (isLastStep && this.form.hasAttribute('data-change-last-button')) {
            this.nextButton.style.display = "inline-block";
            const submitLabel = this.form.getAttribute('data-submit-label') || "Submit";
            this.nextButton.textContent = submitLabel;
            this.nextButton.onclick = () => { this.form.submit(); };
          } else {
            this.nextButton.style.display = isLastStep ? "none" : "inline-block";
            if (this.form.hasAttribute('data-change-last-button')) {
              this.nextButton.textContent = this.nextButton.getAttribute('data-default-label') || "Next";
              this.nextButton.onclick = this.handleNextClick.bind(this);
            }
          }
          if (this.nextButton) {
            this.nextButton.setAttribute("aria-disabled", isLastStep);
          }
        }
        const submitButtons = this.form.querySelectorAll('[type="submit"]');
        submitButtons.forEach((submitButton) => {
          submitButton.style.display = ((filteredSteps.length - 1) === stepIndex && !this.form.hasAttribute('data-change-last-button')) ? "inline-block" : "none";
        });
      }

      updateProgressBar(filteredSteps, stepIndex) {
        const totalSteps = filteredSteps.length;
        const currentStepNumber = stepIndex + 1;
        const progressPercentage = ((currentStepNumber - 1) / (totalSteps - 1)) * 100;
        if (this.progressBar) {
          this.progressBar.style.width = progressPercentage + "%";
        }
        if (this.currentStepElement) {
          this.currentStepElement.textContent = currentStepNumber;
        }
        if (this.totalStepsElement) {
          this.totalStepsElement.textContent = totalSteps;
        }
      }

      validateStep(stepIndex) {
        const step = this.filteredSteps[stepIndex];
        if (!step) return true;
        const inputs = step.querySelectorAll("input, select, textarea");
        for (let input of inputs) {
          if (this.isVisible(input) && !input.checkValidity()) {
            input.reportValidity();
            return false;
          }
        }
        return true;
      }

      validateAllVisibleSteps() {
        for (let i = 0; i < this.filteredSteps.length; i++) {
          if (!this.validateStep(i)) {
            return false;
          }
        }
        return true;
      }

      getFilteredSteps() {
        return this.steps.filter((step) => {
          const condition = step.getAttribute("data-condition");
          if (condition) {
            return this.evaluateCondition(condition);
          }
          return true;
        });
      }

      evaluateCondition(condition) {
        const conditionMatch = condition.match(/(\w+)\s*(==|!=|===|!==|<=|>=|<|>)\s*'([^']*)'/);
        if (conditionMatch) {
          const [, inputName, operator, value] = conditionMatch;
          let inputValue = null;
          const inputs = this.form.querySelectorAll(`[name="${inputName}"]`);
          if (inputs.length > 1) {
            const checkedInput = this.form.querySelector(`[name="${inputName}"]:checked`);
            inputValue = checkedInput ? checkedInput.value : '';
          } else {
            const input = inputs[0];
            if (input) {
              inputValue = (input.type === 'checkbox') ? (input.checked ? input.value || 'on' : '') : input.value;
            }
          }
          if (inputValue !== null) {
            let compareValue = value;
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

      updateRequiredAttributes(filteredSteps) {
        this.steps.forEach((step) => {
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

      handlePrevClick() {
        if (this.stepHistory.length > 0) {
          const prevStepIndex = this.stepHistory.pop();
          this.showStep(prevStepIndex, true);
        } else if (this.currentStep > 0) {
          this.showStep(this.currentStep - 1, true);
        }
      }

      handleNextClick() {
        if (this.validateStep(this.currentStep)) {
          if (this.currentStep < this.filteredSteps.length - 1) {
            this.stepHistory.push(this.currentStep);
            this.showStep(this.currentStep + 1, true);
          }
        }
      }

      setupNavigationListeners() {
        if (this.prevButton) {
          this.prevButton.addEventListener("click", this.handlePrevClick.bind(this));
        }
        if (this.nextButton) {
          this.nextButton.addEventListener("click", this.handleNextClick.bind(this));
          if (this.form.hasAttribute('data-change-last-button') && !this.nextButton.getAttribute('data-default-label')) {
            this.nextButton.setAttribute('data-default-label', this.nextButton.textContent);
          }
        }
      }

      handleFormSubmit(event) {
        this.filterSteps();
        const hiddenRequiredInputs = this.form.querySelectorAll(
          "input[required], select[required], textarea[required]"
        );
        hiddenRequiredInputs.forEach((input) => {
          if (!this.isVisible(input)) {
            input.dataset.originalRequired = "true";
            input.removeAttribute("required");
          }
        });

        if (!this.validateAllVisibleSteps()) {
          event.preventDefault();
          for (let i = 0; i < this.filteredSteps.length; i++) {
            if (!this.validateStep(i)) {
              this.showStep(i, true);
              this.validateStep(i);
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
          if (this.prevButton) this.prevButton.style.display = 'none';
          if (this.nextButton) this.nextButton.style.display = 'none';
          if (this.navContainer) this.navContainer.style.display = 'none';
          if (this.progressWrap) this.progressWrap.style.display = 'none';
        }
      }

      parseKeyCombo(combo) {
        const keys = combo.toLowerCase().split('+');
        return {
          ctrlKey: keys.includes('ctrl'),
          altKey: keys.includes('alt'),
          shiftKey: keys.includes('shift'),
          metaKey: keys.includes('meta'),
          key: keys.find((k) => !['ctrl', 'alt', 'shift', 'meta'].includes(k)),
        };
      }

      matchKeyEvent(event, combo) {
        const parsedCombo = this.parseKeyCombo(combo);
        return (
          event.ctrlKey === parsedCombo.ctrlKey &&
          event.altKey === parsedCombo.altKey &&
          event.shiftKey === parsedCombo.shiftKey &&
          event.metaKey === parsedCombo.metaKey &&
          event.key.toLowerCase() === parsedCombo.key
        );
      }

      handleKeyDown(event) {
        if (!this.keyboardNavEnabled) return;
        if (event.target.tagName === "TEXTAREA") return;
        if (event.key === 'Enter') {
          event.preventDefault();
        }
        if (this.matchKeyEvent(event, this.nextKeyCombo)) {
          event.preventDefault();
          this.handleNextClick();
        } else if (this.matchKeyEvent(event, this.prevKeyCombo)) {
          event.preventDefault();
          this.handlePrevClick();
        } else if (event.key === 'Enter') {
          if (this.currentStep === this.filteredSteps.length - 1 && this.validateStep(this.currentStep)) {
            this.form.submit();
          }
        }
      }

      setupKeyboardNavigation() {
        if (this.keyboardNavEnabled) {
          this.form.addEventListener("keydown", this.handleKeyDown.bind(this));
        }
      }

      setupConditionalListeners() {
        const allInputs = this.form.querySelectorAll("input, select, textarea");
        allInputs.forEach((input) => {
          input.addEventListener("change", this.debouncedFilterSteps.bind(this));
        });
      }

      debounce(func, wait) {
        let timeout;
        return function (...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
        };
      }

      debouncedFilterSteps = this.debounce(() => {
        this.filterSteps();
        if (!this.filteredSteps.includes(this.steps[this.currentStep])) {
          if (this.currentStep >= this.filteredSteps.length) {
            this.currentStep = this.filteredSteps.length - 1;
          }
          this.showStep(this.currentStep, false);
        } else {
          this.updateNavSteps(this.filteredSteps, this.currentStep);
          this.updateButtons(this.filteredSteps, this.currentStep);
          this.updateProgressBar(this.filteredSteps, this.currentStep);
          this.updateRequiredAttributes(this.filteredSteps);
        }
      }, 100);
    }

    // Initialize all multistep forms on the page and store instance on the wrapper
    const wrappers = document.querySelectorAll('[ms="wrapper"]');
    wrappers.forEach((wrapper) => {
      const instance = new MultiStepForm(wrapper);
      wrapper.multiStepFormInstance = instance;
    });

    console.log("All multistep forms have been initialized successfully. v2.3.4");
  })();
});
