# Multistep Form – Modular, Scalable, and Customizable

This solution is a modular multistep form system designed to work seamlessly on pages with one or more forms. It provides full control over which elements are treated as steps, supports conditional logic, form validation, progress indicators, custom keyboard navigation, and optional customization of navigation buttons—including converting the “Next” button into a submit button on the last step.

---

## Features

- **Modular & Scalable:**  
  Encapsulated in a `MultiStepForm` class so you can have multiple independent multistep forms on the same page.

- **Custom Step Definition:**  
  Only elements with the `ms-step` attribute inside the form are treated as steps. Optionally use `ms-step-name` to label each step.

- **Conditional Logic:**  
  Use `data-condition` on steps to show or hide them based on user input.

- **Form Validation:**  
  Validates inputs in the current step before allowing navigation to the next step.

- **Progress Indicators:**  
  Displays a progress bar and step counter using elements with `ms-progress-wrap`, `ms-progress-bar`, `ms-current-step`, and `ms-total-steps`.

- **Custom Keyboard Navigation:**  
  Enable keyboard navigation with customizable key combinations (default: Shift+Enter for next, Alt+Enter for previous). The default Enter key behavior is suppressed (except on the last step).

- **Optional Navigation Buttons:**  
  Global next/prev buttons are optional. If you supply custom buttons within a step (using the API), the global buttons aren’t required.

- **Submit Button on Last Step:**  
  Optionally, the global next button can be converted into a submit button on the last step by adding the attribute `data-change-last-button` (and customizing the label via `data-submit-label`).

- **Visual Divider Removal:**  
  Elements with `ms-step-divider` (used for visual separation in editors like Webflow) are automatically removed from the live form.

- **Accessibility:**  
  Implements ARIA roles and proper focus management for improved accessibility.

- **Non-AJAX Submission:**  
  The form submits naturally (using its action and method) to ensure compatibility with platforms like Webflow.

---

## Setup & Installation

### 1. Include the Script

Place the following script just before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

You only need to include the script once even if you have multiple multistep forms on the page.

### 2. Structure Your HTML

#### Wrapper

Wrap each multistep form inside its own container with the attribute `ms="wrapper"`:

```html
<div ms="wrapper">
  <!-- Multistep form content -->
</div>
```

#### Form Element

Inside the wrapper, use a standard `<form>` element. Add `ms-keyboard-nav` to enable keyboard navigation and optionally customize key combos with `data-next-key` and `data-prev-key`:

```html
<form ms-keyboard-nav data-next-key="Shift+Enter" data-prev-key="Alt+Enter" action="/submit-form" method="POST">
  <!-- Steps go here -->
</form>
```

#### Defining Steps

Only elements with the `ms-step` attribute are treated as steps. You can provide a custom label with `ms-step-name`:

```html
<form>
  <div ms-step ms-step-name="Step 1">
    <!-- Step 1 content -->
  </div>
  <div ms-step ms-step-name="Step 2">
    <!-- Step 2 content -->
  </div>
  <!-- Additional steps -->
</form>
```

##### Conditional Steps

Add a `data-condition` attribute to any step to control its visibility:

```html
<div ms-step data-condition="customerType == 'business'" ms-step-name="Business Details">
  <!-- Business-specific fields -->
</div>
```

#### Visual Dividers (Optional)

For editing purposes, you can include elements with the `ms-step-divider` attribute. They will be removed automatically on page load:

```html
<div ms-step-divider>
  <!-- Divider content (e.g., a horizontal line) -->
</div>
```

#### Navigation Buttons

Place global navigation buttons inside the wrapper. They are optional; if you provide custom buttons within your steps, the global ones aren’t required:

```html
<button type="button" ms-nav="prev">Previous</button>
<button type="button" ms-nav="next">Next</button>
```

#### Progress Indicators (Optional)

Add progress bar elements and step counters within the wrapper:

```html
<div ms-progress-wrap>
  <div ms-progress-bar></div>
</div>
<p>Step <span ms-current-step></span> of <span ms-total-steps></span></p>
```

#### Success Message (Optional)

Use your platform’s built-in success message or add a custom one. The script hides navigation elements on submission to ensure a clean display of the success message:

```html
<!-- For platforms like Webflow, built-in messages are used. Otherwise, add your custom success message here. -->
<div class="w-form-done">
  <div>Thank you! Your submission has been received!</div>
</div>
```

---

## Custom Keyboard Navigation

- **Enable:** Add `ms-keyboard-nav` to your `<form>`.
- **Customize Keys:** Use `data-next-key` and `data-prev-key` attributes.
- **Default Behavior:**
  - **Next Step:** Shift+Enter
  - **Previous Step:** Alt+Enter
  - **Submission:** Press Enter on the last step (if valid)

Example:

```html
<form ms-keyboard-nav data-next-key="Shift+Enter" data-prev-key="Alt+Enter" action="/submit-form" method="POST">
  <!-- Steps -->
</form>
```

---

## Changing the Global Next Button on the Last Step

To avoid having the navigation and submit button in separate places on the last step, you can have the global next button change into a submit button. Add the attribute `data-change-last-button="true"` on the form. Optionally, set a custom label with `data-submit-label`.

Example:

```html
<form ms-keyboard-nav data-change-last-button="true" data-submit-label="Send Now" action="/submit-form" method="POST">
  <!-- Steps -->
</form>
```

On the last step, the global next button will now display as “Send Now” and submit the form when clicked.

---

## Multiple Multistep Forms on One Page

Each multistep form must be contained in its own wrapper with `ms="wrapper"`. This scopes all functionality (steps, navigation, progress, keyboard events) to that form only.

Example:

```html
<!-- First Multistep Form -->
<div ms="wrapper">
  <form ms-keyboard-nav action="/submit-form" method="POST">
    <!-- Steps -->
  </form>
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>

<!-- Second Multistep Form -->
<div ms="wrapper">
  <form ms-keyboard-nav action="/another-submit" method="POST">
    <!-- Steps -->
  </form>
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>
```

---

## Styling Suggestions

### Progress Bar

```css
[ms-progress-wrap] {
  width: 100%;
  background-color: #e0e0e0;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

[ms-progress-bar] {
  width: 0%;
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}
```

### Navigation Steps

```css
.nav-step.is-active {
  font-weight: bold;
}

.nav-step.is-deactive {
  opacity: 0.5;
  pointer-events: none;
}
```

---

## Complete Example

```html
<!-- First Multistep Form -->
<div ms="wrapper">
  <!-- Progress Bar -->
  <div ms-progress-wrap>
    <div ms-progress-bar></div>
  </div>
  <p>Step <span ms-current-step></span> of <span ms-total-steps></span></p>

  <!-- Form -->
  <form ms-keyboard-nav data-change-last-button="true" data-submit-label="Send Now" action="/submit-form" method="POST">
    <!-- Step 1 -->
    <div ms-step ms-step-name="Customer Type">
      <label>
        <input type="radio" name="customerType" value="individual" required>
        Individual
      </label>
      <label>
        <input type="radio" name="customerType" value="business">
        Business
      </label>
    </div>

    <!-- Divider (template purpose only; will be removed) -->
    <div ms-step-divider>
      <!-- Divider content (e.g., a horizontal line) -->
    </div>

    <!-- Step 2 (Conditional) -->
    <div ms-step data-condition="customerType == 'business'" ms-step-name="Business Details">
      <!-- Business-specific fields -->
    </div>

    <!-- Step 3 -->
    <div ms-step ms-step-name="Contact Information">
      <!-- Contact fields -->
    </div>

    <!-- Submit Button (native submit button, shown only on last step if not using change-last-button) -->
    <button type="submit">Submit</button>
  </form>

  <!-- Global Navigation Buttons -->
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>

<!-- Second Multistep Form -->
<div ms="wrapper">
  <!-- Progress Bar -->
  <div ms-progress-wrap>
    <div ms-progress-bar></div>
  </div>
  <p>Step <span ms-current-step></span> of <span ms-total-steps></span></p>

  <!-- Form -->
  <form ms-keyboard-nav action="/another-submit" method="POST">
    <!-- Step A -->
    <div ms-step ms-step-name="Step A">
      <!-- Content for Step A -->
    </div>
    <!-- Step B -->
    <div ms-step ms-step-name="Step B">
      <!-- Content for Step B -->
    </div>
    <button type="submit">Submit</button>
  </form>

  <!-- Global Navigation Buttons -->
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>

<!-- Include the script once -->
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

---

## Key Points

- **Custom Steps:**  
  Only elements with `ms-step` are treated as steps. Use `ms-step-name` for custom labels.

- **Conditional Logic:**  
  Use `data-condition` to show/hide steps based on user inputs.

- **Progress Indicators:**  
  Progress bar and step counter update automatically.

- **Keyboard Navigation:**  
  Default key combos are Shift+Enter (next) and Alt+Enter (prev); customizable via data attributes.

- **Global Navigation Buttons (Optional):**  
  These buttons are optional. You can use custom navigation buttons within steps via the provided API.

- **Last-Step Submit Option:**  
  With `data-change-last-button="true"`, the global next button becomes a submit button on the last step (customizable with `data-submit-label`).

- **Visual Dividers:**  
  Elements with `ms-step-divider` are removed automatically.

- **Multiple Forms:**  
  Each multistep form is scoped inside its own wrapper (`ms="wrapper"`) so multiple forms work independently.

- **Accessibility:**  
  ARIA roles and focus management are built-in.

- **Natural Form Submission:**  
  The form submits via its action/method attributes (no AJAX).

---

## Best Practices

- **Define Steps Clearly:**  
  Ensure every step element has `ms-step` and, optionally, `ms-step-name`.

- **Use Scoped Wrappers:**  
  Place each multistep form in its own `ms="wrapper"` to avoid conflicts with other forms.

- **Customize Keyboard Shortcuts:**  
  Adjust `data-next-key` and `data-prev-key` as needed.

- **Test Thoroughly:**  
  Validate that navigation, validation, progress updates, and conditional logic work as expected.

- **Accessibility:**  
  Confirm that ARIA attributes are functioning correctly and that keyboard navigation does not conflict with assistive technologies.

---

## Troubleshooting

- **Form Not Submitting:**  
  Ensure all required fields are valid; remember that Enter only submits on the last step.

- **Steps Not Displaying Correctly:**  
  Check that all step elements have `ms-step` and that `data-condition` values are correct.

- **Keyboard Navigation Issues:**  
  Verify that `ms-keyboard-nav` is set and custom key combinations are correct.

- **Progress Bar Not Updating:**  
  Ensure progress elements (`ms-progress-wrap`, `ms-progress-bar`, etc.) are within the correct wrapper.

- **Multiple Forms Interference:**  
  Make sure each form is properly wrapped in its own container with `ms="wrapper"`.

- **Submit Button Placement:**  
  If using the last-step submit option, confirm that `data-change-last-button` is set on the form and that `data-submit-label` (if desired) is provided.

---

## Performance, Scalability & Accessibility

- **Performance:**  
  The script uses debouncing and is scoped to each form, minimizing DOM operations.

- **Scalability:**  
  The modular design allows multiple multistep forms on one page without conflict.

- **Accessibility:**  
  ARIA roles, focus management, and customizable keyboard navigation help ensure the form is accessible.

---

## Conclusion

This multistep form solution offers a flexible, scalable way to create engaging forms with step-by-step navigation, conditional logic, and built-in progress indicators. It supports multiple forms on one page, customizable keyboard navigation, and optional transformation of the global next button into a submit button on the last step—all while ensuring accessibility and performance.

Happy coding! If you have any further questions or need assistance, please feel free to ask.
