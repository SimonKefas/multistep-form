# **Multistep Form with Conditional Navigation, Success Message, and Progress Bar**

This README provides a comprehensive guide on implementing a multistep form with conditional logic, restricted forward navigation, keyboard support, a progress bar, and a custom success message. The script allows for complex forms where steps can be shown or hidden based on user input, users cannot skip required steps by clicking ahead, and a progress bar visually indicates the user's progress through the form.

---

## **Table of Contents**

1. [Introduction](#introduction)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
   - [HTML Structure](#html-structure)
   - [Required Attributes](#required-attributes)
   - [Including the Script](#including-the-script)
4. [Navigation Setup](#navigation-setup)
   - [Navigation Elements](#navigation-elements)
   - [Styling Navigation Steps](#styling-navigation-steps)
5. [Progress Bar Setup](#progress-bar-setup)
   - [Progress Bar Elements](#progress-bar-elements)
   - [Styling the Progress Bar](#styling-the-progress-bar)
6. [Conditional Steps](#conditional-steps)
   - [Using `data-condition`](#using-data-condition)
   - [Supported Operators](#supported-operators)
   - [Examples](#examples)
7. [Keyboard Navigation](#keyboard-navigation)
   - [Enabling Keyboard Navigation](#enabling-keyboard-navigation)
   - [Usage](#usage)
8. [Success Message Handling](#success-message-handling)
   - [Displaying a Custom Success Message](#displaying-a-custom-success-message)
   - [How It Works](#how-it-works)
9. [Validation Handling](#validation-handling)
10. [Accessibility Features](#accessibility-features)
11. [API Methods](#api-methods)
12. [Example Implementation](#example-implementation)
13. [Best Practices](#best-practices)
14. [Troubleshooting](#troubleshooting)
15. [Conclusion](#conclusion)

---

## **1. Introduction**

This multistep form script enhances a standard HTML form by splitting it into multiple steps, adding conditional logic, validation, restricted navigation, keyboard support, a progress bar, and a custom success message. Users can navigate through the form using "Next" and "Previous" buttons. A navigation bar displays the steps, and a progress bar provides visual feedback on the user's progress. Upon successful submission, the form hides, and a custom success message is displayed.

---

## **2. Features**

- **Conditional Steps**: Show or hide steps based on user inputs using `data-condition`.
- **Restricted Forward Navigation**: Users cannot navigate to future steps via the navigation bar, preventing skipping required steps.
- **Progress Bar**: Visually indicates the user's progress through the form.
- **Keyboard Navigation**: Optional support for navigating with the Enter key.
- **Custom Success Message**: Display a custom message upon successful form submission.
- **Validation**: Validates inputs in visible steps, blocking navigation if validation fails.
- **Navigation History**: Tracks visited steps for proper back navigation.
- **Accessibility**: Implements ARIA attributes and roles for better accessibility.
- **Customizable Styling**: Add classes to style navigation steps, progress bar, and success message.

---

## **3. Setup Instructions**

### **HTML Structure**

- **Wrapper Element**: Wrap your form inside a container with the attribute `ms="wrapper"`.

  ```html
  <div ms="wrapper">
    <form ms-keyboard-nav action="/submit-form" method="POST">
      <!-- Steps go here -->
    </form>
  </div>
  ```

- **Steps**: Each step is a direct child `<div>` of the `<form>`.

  ```html
  <form ms-keyboard-nav action="/submit-form" method="POST">
    <div ms-step-name="Step 1">
      <!-- Content for Step 1 -->
    </div>
    <div ms-step-name="Step 2">
      <!-- Content for Step 2 -->
    </div>
    <!-- Additional steps -->
  </form>
  ```

  **Note**: The `ms-keyboard-nav` attribute on the `<form>` enables keyboard navigation. Set the `action` and `method` attributes according to your server endpoint.

### **Required Attributes**

- **Navigation Buttons**:
  - **Previous Button**: `ms-nav="prev"`
  - **Next Button**: `ms-nav="next"`

  ```html
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
  ```

### **Including the Script**

Include the script via the CDN link before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

---

## **4. Navigation Setup**

### **Navigation Elements**

To display a navigation bar showing the steps, include:

- **Navigation Container**: An element with `ms-nav-steps="container"`.

  ```html
  <div ms-nav-steps="container">
    <!-- Navigation steps will be generated here -->
  </div>
  ```

- **Navigation Step Template**: An element with `ms-nav-steps="step"` (usually hidden).

  ```html
  <div style="display: none;">
    <div ms-nav-steps="step" class="nav-step">Step</div>
  </div>
  ```

- **Navigation Divider Template**: (Optional) An element with `ms-nav-steps="divider"` for separators between steps.

  ```html
  <div style="display: none;">
    <span ms-nav-steps="divider" class="nav-divider">></span>
  </div>
  ```

### **Styling Navigation Steps**

- **Active Step**: The navigation step corresponding to the current step will have the class `is-active`.
- **Deactivated Steps**: Future steps will have the class `is-deactive`.

**Example CSS**:

```css
.nav-step.is-active {
  font-weight: bold;
}

.nav-step.is-deactive {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## **5. Progress Bar Setup**

### **Progress Bar Elements**

Include the progress bar elements in your HTML where you want the progress bar to appear.

```html
<!-- Progress Bar Wrapper -->
<div ms-progress-wrap>
  <div ms-progress-bar></div>
</div>

<!-- Step Indicators -->
<p>
  Step <span ms-current-step></span> of <span ms-total-steps></span>
</p>
```

**Notes:**

- Place these elements inside the `ms="wrapper"` container but outside the `<form>` if desired.
- The elements with `ms-current-step` and `ms-total-steps` will display the current step number and total steps, respectively.

### **Styling the Progress Bar**

Add CSS to style the progress bar according to your design preferences.

**Example CSS**:

```css
/* Progress Bar Wrapper */
[ms-progress-wrap] {
  width: 100%;
  background-color: #e0e0e0;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

/* Progress Bar Fill */
[ms-progress-bar] {
  width: 0%;
  height: 100%;
  background-color: #3b82f6; /* Adjust color as needed */
  transition: width 0.3s ease;
}

/* Step Indicators */
[ms-current-step],
[ms-total-steps] {
  font-weight: bold;
}
```

---

## **6. Conditional Steps**

### **Using `ms-step-divider`**

To visually separate steps in web editors like Webflow, you can use `ms-step-divider` elements. These dividers will be removed from the live site by the script.

```html
<div ms-step-divider></div>
```

### **Using `data-condition`**

Add `data-condition` to steps to control their visibility based on input values.

```html
<div data-condition="inputName == 'value'">
  <!-- This step shows only if the input named 'inputName' equals 'value' -->
</div>
```

### **Supported Operators**

- `==` : Equal to
- `!=` : Not equal to
- `===` : Strict equal to
- `!==` : Strict not equal to
- `<`  : Less than (numeric comparison)
- `<=` : Less than or equal to (numeric comparison)
- `>`  : Greater than (numeric comparison)
- `>=` : Greater than or equal to (numeric comparison)

### **Examples**

#### **Radio Button Selection**

```html
<!-- Radio buttons -->
<label>
  <input type="radio" name="customer" value="private" required>
  Private
</label>
<label>
  <input type="radio" name="customer" value="company">
  Company
</label>

<!-- Conditional Steps -->
<div data-condition="customer == 'private'" ms-step-name="Private Information">
  <!-- Content for Private customers -->
</div>

<div data-condition="customer == 'company'" ms-step-name="Company Information">
  <!-- Content for Company customers -->
</div>
```

#### **Text Input (Non-Empty Value)**

```html
<!-- Text input field -->
<label for="username">Username:</label>
<input type="text" name="username" id="username">

<!-- Conditional step that shows only if 'username' is not empty -->
<div data-condition="username != ''" ms-step-name="Welcome">
  <p>Welcome, <span id="display-username"></span>!</p>
</div>
```

---

## **7. Keyboard Navigation**

### **Enabling Keyboard Navigation**

To enable keyboard navigation, add the `ms-keyboard-nav` attribute to your `<form>` element.

```html
<form ms-keyboard-nav>
  <!-- Form steps -->
</form>
```

### **Usage**

- **Enter Key**: Press **Enter** to proceed to the next step.
- **Ctrl+Enter** or **Cmd+Enter**: Press **Ctrl+Enter** (Windows) or **Cmd+Enter** (Mac) to submit the form on the last step.
- **Notes**:
  - Keyboard navigation ignores **Enter** presses in `<textarea>` fields to allow for multiline input.
  - This feature is optional and must be enabled via the `ms-keyboard-nav` attribute.

---

## **8. Success Message Handling**

### **Displaying a Custom Success Message**

When the form is successfully submitted, you may want to display a custom success message and hide the form and navigation elements.

#### **Instructions**

1. **Add the Success Message Div**

   Include a div with the `ms-success` attribute in your HTML where you want the success message to appear.

   ```html
   <div ms-success>
     <!-- Your custom success message -->
     <h2>Thank you for your submission!</h2>
     <p>We have received your information and will get back to you shortly.</p>
   </div>
   ```

   **Note**: Place this div inside the `ms="wrapper"` container but outside the `<form>` element.

2. **Style the Success Message Div**

   Ensure the success message is hidden initially:

   ```css
   [ms-success] {
     display: none;
   }
   ```

   The script will automatically show this div upon successful form submission.

### **How It Works**

- **AJAX Form Submission**: The script handles form submission via AJAX to prevent the default page reload.
- **Upon Successful Submission**:
  - The form, navigation buttons, navigation steps, and progress bar are hidden.
  - The success message div (`ms-success`) is displayed.
- **Server Response**:
  - Ensure your server endpoint specified in the form's `action` attribute can handle the form data submission and returns an appropriate HTTP status code (200 for success).
- **Error Handling**:
  - If the server returns an error status, the script logs the error to the console.
  - Customize error handling as needed.

---

## **9. Validation Handling**

- **Visible Inputs**: Only inputs in the current visible step are validated.
- **Required Fields**: Required attributes are managed dynamically to prevent validation of hidden fields.
- **Validation Messages**: Standard HTML5 validation messages are used; customize using `title` attributes if needed.

---

## **10. Accessibility Features**

- **ARIA Attributes**: Steps, navigation elements, and progress bar include appropriate ARIA roles and attributes.
- **Focus Management**: The first input in each step is focused when the step is displayed.

**Example for Progress Bar**:

```html
<!-- Progress Bar with ARIA Roles -->
<div ms-progress-wrap role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
  <div ms-progress-bar></div>
</div>
```

Update `aria-valuenow` dynamically if needed (the script currently does not update this attribute).

---

## **11. API Methods**

The script provides an API accessible via `window.multiStepFormAPI`.

- **`getCurrentStep()`**: Returns the index of the current step.
- **`validateCurrentStep()`**: Validates inputs in the current step.
- **`nextStep()`**: Moves to the next step if validation passes.
- **`prevStep()`**: Moves to the previous step.

**Note**: Forward navigation via `setStep(stepIndex)` is restricted to prevent skipping steps.

---

## **12. Example Implementation**

```html
<!-- Wrapper -->
<div ms="wrapper">
  <!-- Progress Bar -->
  <div ms-progress-wrap>
    <div ms-progress-bar></div>
  </div>

  <!-- Step Indicators -->
  <p>
    Step <span ms-current-step></span> of <span ms-total-steps></span>
  </p>

  <!-- Form -->
  <form ms-keyboard-nav action="/submit-form" method="POST">
    <!-- Step 1: Customer Type Selection -->
    <div ms-step-name="Customer Type">
      <p>Please select customer type:</p>
      <label>
        <input type="radio" name="customer" value="private" required>
        Private
      </label>
      <label>
        <input type="radio" name="customer" value="company">
        Company
      </label>
    </div>

    <!-- Step Divider (for visual separation in editors) -->
    <div ms-step-divider></div>

    <!-- Step 2: Product Selection -->
    <div ms-step-name="Product Selection">
      <!-- Product selection fields -->
    </div>

    <!-- Conditional Steps and Dividers -->
    <div ms-step-divider></div>

    <!-- Step 3: Company Information (Conditional) -->
    <div data-condition="customer == 'company'" ms-step-name="Company Information">
      <!-- Fields for company information -->
    </div>

    <!-- Step Divider -->
    <div ms-step-divider></div>

    <!-- Step 4: Private Information (Conditional) -->
    <div data-condition="customer == 'private'" ms-step-name="Private Information">
      <!-- Fields for private customer information -->
    </div>

    <!-- Step Divider -->
    <div ms-step-divider></div>

    <!-- Step 5: Confirmation -->
    <div ms-step-name="Confirmation">
      <!-- Confirmation details and submit button -->
      <button type="submit">Submit</button>
    </div>
  </form>

  <!-- Navigation Buttons -->
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>

  <!-- Navigation Steps Container -->
  <div ms-nav-steps="container"></div>

  <!-- Navigation Templates (Hidden) -->
  <div style="display: none;">
    <div ms-nav-steps="step" class="nav-step">Step</div>
    <span ms-nav-steps="divider" class="nav-divider">></span>
  </div>

  <!-- Success Message -->
  <div ms-success>
    <h2>Thank you for your submission!</h2>
    <p>We have received your information and will get back to you shortly.</p>
  </div>
</div>

<!-- Include the script -->
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

---

## **13. Best Practices**

- **Consistent Input Names**: Ensure the `name` attributes of inputs match those used in `data-condition`.
- **Avoid Skipping Steps**: Use the script's navigation restrictions to prevent users from skipping required steps.
- **Style Deactivated Steps**: Use the "is-deactive" class to visually indicate steps that are not yet accessible.
- **Customize the Progress Bar**: Adjust the CSS to match your site's branding and layout.
- **Test Thoroughly**: Test your form with various inputs to ensure conditional logic, validation, progress bar updates, and success message display work as expected.
- **Accessibility Compliance**: Ensure your styles do not interfere with the ARIA attributes and roles.
- **Use `ms-step-divider` for Visual Editing**: Utilize `ms-step-divider` in editors like Webflow to separate steps visually; these will be removed on the live site.
- **Server-Side Handling**: Ensure your server endpoint can handle the form data submission and returns appropriate HTTP status codes.
- **Error Handling**: Customize the error handling in the script if needed to provide feedback to the user upon submission errors.

---

## **14. Troubleshooting**

- **Steps Not Showing/Hiding Correctly**:
  - Verify `data-condition` syntax and input names.
  - Ensure the `value` attributes in inputs match those used in conditions.

- **Navigation Issues**:
  - Confirm that the navigation elements have the correct attributes (`ms-nav-steps`).
  - Ensure the script is correctly included and no JavaScript errors are present.

- **Validation Errors**:
  - Check that required fields are correctly set and only on visible steps.
  - Make sure validation messages are displaying for the correct inputs.

- **Progress Bar Not Updating**:
  - Ensure the progress bar elements have the correct attributes (`ms-progress-wrap`, `ms-progress-bar`, `ms-current-step`, `ms-total-steps`).
  - Verify that the CSS styles are correctly applied.

- **Keyboard Navigation Not Working**:
  - Ensure the `ms-keyboard-nav` attribute is added to the `<form>` element.
  - Check for conflicts with other scripts or event listeners.

- **Success Message Not Displaying**:
  - Confirm that the success message div has the `ms-success` attribute.
  - Ensure the server is returning an HTTP status code of 200 upon successful submission.
  - Check the console for any submission errors.

- **Form Not Submitting**:
  - Ensure the form's `action` and `method` attributes are correctly set.
  - Verify that the server endpoint is accessible and properly configured to handle the form data.

- **Styles Not Applying**:
  - Verify that the classes `is-active` and `is-deactive` are correctly used in your CSS.
  - Ensure that CSS selectors match the elements correctly.

---

## **15. Conclusion**

By following this guide, you can effectively implement a multistep form with conditional logic, restricted forward navigation, keyboard navigation, a progress bar, and a custom success message. The script ensures users complete all required steps in order, provides visual feedback on their progress, and enhances the overall user experience by displaying a success message upon submission.

---

**If you need further assistance or have any questions, feel free to reach out!**

---

# **Final Notes**

- **Script Updates**: The script now handles `ms-step-divider` elements, supports optional keyboard navigation, includes success message handling, and provides the latest features.
- **CDN Link**: Use the provided CDN link to include the latest version of the script.
- **Customization**: Feel free to customize the script and styles to suit your project's needs.
- **Server-Side Handling**: Ensure your server can handle the form submission and returns appropriate responses.

---

Thank you for using the multistep form script! We hope it enhances your form's functionality and user experience.