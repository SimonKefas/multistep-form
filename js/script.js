document.addEventListener("DOMContentLoaded", function () {
  (function () {
    class MultiStepForm {
      constructor(wrapper) {
        this.wrapper = wrapper;
        this.form = wrapper.querySelector('form');
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

      // Gather all elements with [ms-step], building the main steps array
      filterSteps() {
        // Only consider elements with the 'ms-step' attribute within the form
        this.steps = Array.from(this.form.querySelectorAll('[ms-step]'));
        this.filteredSteps = this.getFilteredSteps();
      }

      // Utility to check if an element is currently visible
      isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      }

      // Show a specific step
      showStep(stepIndex, shouldFocus = false) {
        this.filterSteps(); // Update the list of valid steps

        // Hide all steps
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

        this.currentStep = stepIndex; // Track the new current step
      }

      // Populate the step navigation container
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

          // Merge ms-step and ms-step-name logic:
          // if ms-step has a value => that's the step's name; if empty => no name
          const stepName = step.getAttribute("ms-step") || "";
          const stepClone = this.navStepTemplate.cloneNode(true);
          stepClone.removeAttribute("ms-nav-steps");
          stepClone.textContent = stepName; // empty string => no name shown

          stepClone.classList.toggle("is-active", index === currentStepIndex);
          stepClone.classList.toggle("is-deactive", index > currentStepIndex);

          stepClone.setAttribute("aria-selected", index === currentStepIndex);
          stepClone.setAttribute("role", "tab");
          stepClone.setAttribute("tabindex", index === currentStepIndex ? "0" : "-1");

          if (index <= currentStepIndex) {
            stepClone.addEventListener("click", () => {
              if (index < currentStepIndex) {
                this.stepHistory.push(this.currentStep);
                this.showStep(index, false); // No autofocus on click
              }
            });
          } else {
            stepClone.style.pointerEvents = "none";
          }
          fragment.appendChild(stepClone);
        });

        this.navContainer.appendChild(fragment);
      }

      // Manage next/prev buttons (including last-step logic)
      updateButtons(filteredSteps, stepIndex) {
        // If there's a global prev button
        if (this.prevButton) {
          this.prevButton.style.display = stepIndex === 0 ? "none" : "inline-block";
          this.prevButton.setAttribute("aria-disabled", stepIndex === 0);
        }

        // If there's a global next button
        if (this.nextButton) {
          const isLastStep = (stepIndex === filteredSteps.length - 1);

          // If the form has data-change-last-button => transform next button into submit on last step
          if (isLastStep && this.form.hasAttribute('data-change-last-button')) {
            this.nextButton.style.display = "inline-block";
            const submitLabel = this.form.getAttribute('data-submit-label') || "Submit";
            this.nextButton.textContent = submitLabel;
            // Convert next button to submit action
            this.nextButton.onclick = () => {
              this.form.submit();
            };
          } else {
            // normal next button behavior
            this.nextButton.style.display = isLastStep ? "none" : "inline-block";
            // restore default label if previously changed
            if (this.form.hasAttribute('data-change-last-button')) {
              this.nextButton.textContent = this.nextButton.getAttribute('data-default-label') || "Next";
              this.nextButton.onclick = this.handleNextClick.bind(this);
            }
          }
          if (this.nextButton) {
            this.nextButton.setAttribute("aria-disabled", isLastStep);
          }
        }

        // Handle the form's native submit buttons
        const submitButtons = this.form.querySelectorAll('[type="submit"]');
        submitButtons.forEach((submitButton) => {
          // If not using data-change-last-button, display the native submit button on last step
          const isLastStep = (filteredSteps.length - 1) === stepIndex;
          submitButton.style.display = (isLastStep && !this.form.hasAttribute('data-change-last-button'))
            ? "inline-block"
            : "none";
        });
      }

      // Update progress bar or step count
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

      // Validate the inputs in a single step
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

      // Validate all currently visible steps
      validateAllVisibleSteps() {
        for (let i = 0; i < this.filteredSteps.length; i++) {
          if (!this.validateStep(i)) {
            return false;
          }
        }
        return true;
      }

      // Filter out steps hidden by data-condition
      getFilteredSteps() {
        return this.steps.filter((step) => {
          const condition = step.getAttribute("data-condition");
          if (condition) {
            return this.evaluateCondition(condition);
          }
          return true;
        });
      }

      // Evaluate the condition for step visibility
      evaluateCondition(condition) {
        // e.g. data-condition="someField == 'someValue'"
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
              if (input.type === 'checkbox') {
                inputValue = input.checked ? input.value || 'on' : '';
              } else {
                inputValue = input.value;
              }
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

      // Manage required attributes for only visible steps
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

      // Handler for clicking the global prev button
      handlePrevClick() {
        if (this.stepHistory.length > 0) {
          const prevStepIndex = this.stepHistory.pop();
          this.showStep(prevStepIndex, true);
        } else if (this.currentStep > 0) {
          this.showStep(this.currentStep - 1, true);
        }
      }

      // Handler for clicking the global next button
      handleNextClick() {
        if (this.validateStep(this.currentStep)) {
          if (this.currentStep < this.filteredSteps.length - 1) {
            this.stepHistory.push(this.currentStep);
            this.showStep(this.currentStep + 1, true);
          }
        }
      }

      // Attach event listeners to global prev/next buttons if present
      setupNavigationListeners() {
        if (this.prevButton) {
          this.prevButton.addEventListener("click", this.handlePrevClick.bind(this));
        }
        if (this.nextButton) {
          this.nextButton.addEventListener("click", this.handleNextClick.bind(this));
          // Remember the default label if we plan to change it on last step
          if (this.form.hasAttribute('data-change-last-button') && !this.nextButton.getAttribute('data-default-label')) {
            this.nextButton.setAttribute('data-default-label', this.nextButton.textContent);
          }
        }
      }

      // Submit handler for the form
      handleFormSubmit(event) {
        this.filterSteps();
        const hiddenRequiredInputs = this.form.querySelectorAll("input[required], select[required], textarea[required]");
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
          // Hide global navigation elements upon successful validation
          if (this.prevButton) this.prevButton.style.display = 'none';
          if (this.nextButton) this.nextButton.style.display = 'none';
          if (this.navContainer) this.navContainer.style.display = 'none';
          if (this.progressWrap) this.progressWrap.style.display = 'none';
          // Let the form submit
        }
      }

      // Helpers for custom keyboard combos
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

      // KeyDown handler for the form
      handleKeyDown(event) {
        if (!this.keyboardNavEnabled) return;
        if (event.target.tagName === "TEXTAREA") return; // allow normal Enter in a textarea
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
          // Only allow natural submission on the last step if valid
          if (this.currentStep === this.filteredSteps.length - 1 && this.validateStep(this.currentStep)) {
            this.form.submit();
          }
        }
      }

      // Attach the keyboard event only if ms-keyboard-nav
      setupKeyboardNavigation() {
        if (this.keyboardNavEnabled) {
          this.form.addEventListener("keydown", this.handleKeyDown.bind(this));
        }
      }

      // Listen for changes in any input to refilter steps
      setupConditionalListeners() {
        const allInputs = this.form.querySelectorAll("input, select, textarea");
        allInputs.forEach((input) => {
          input.addEventListener("change", this.debouncedFilterSteps.bind(this));
        });
      }

      // Simple debounce to handle re-filtering
      debounce(func, wait) {
        let timeout;
        return function (...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
        };
      }

      debouncedFilterSteps = this.debounce(() => {
        this.filterSteps();
        // If the current step is no longer included in filteredSteps, adjust
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

    // Initialize all multistep forms on the page
    const wrappers = document.querySelectorAll('[ms="wrapper"]');
    wrappers.forEach((wrapper) => {
      new MultiStepForm(wrapper);
    });

    console.log("All multistep forms have been initialized successfully. v2.3.5");
  })();
});
