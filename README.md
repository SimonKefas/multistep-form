# **Multistep Form with Conditional Navigation and Restricted Forward Navigation**

This README provides a comprehensive guide on how to implement and use the multistep form script with conditional logic and restricted forward navigation. The script allows you to create complex forms where steps can be shown or hidden based on user input, and users cannot skip required steps by clicking ahead in the navigation bar.

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
5. [Conditional Steps](#conditional-steps)
   - [Using `data-condition`](#using-data-condition)
   - [Supported Operators](#supported-operators)
   - [Examples](#examples)
6. [Validation Handling](#validation-handling)
7. [Accessibility Features](#accessibility-features)
8. [API Methods](#api-methods)
9. [Example Implementation](#example-implementation)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Conclusion](#conclusion)

---

## **1. Introduction**

This multistep form script enhances a standard HTML form by splitting it into multiple steps, adding conditional logic, validation, and restricted navigation. Users can navigate through the form using "Next" and "Previous" buttons, and a navigation bar displays the steps. Forward navigation via the navigation bar is restricted to prevent users from skipping required steps.

---

## **2. Features**

- **Conditional Steps**: Show or hide steps based on user inputs using `data-condition`.
- **Restricted Forward Navigation**: Users cannot navigate to future steps via the navigation bar, preventing skipping required steps.
- **Validation**: Validates inputs in visible steps, blocking navigation if validation fails.
- **Navigation History**: Tracks visited steps for proper back navigation.
- **Accessibility**: Implements ARIA attributes and roles for better accessibility.
- **Customizable Styling**: Add classes to style navigation steps (e.g., "is-active", "is-deactive").

---

## **3. Setup Instructions**

### **HTML Structure**

- **Wrapper Element**: Wrap your form inside a container with the attribute `ms="wrapper"`.

  ```html
  <div ms="wrapper">
    <form>
      <!-- Steps go here -->
    </form>
  </div>
  ```

- **Steps**: Each step is a direct child `<div>` of the `<form>`.

  ```html
  <form>
    <div ms-step-name="Step 1">
      <!-- Content for Step 1 -->
    </div>
    <div ms-step-name="Step 2">
      <!-- Content for Step 2 -->
    </div>
    <!-- Additional steps -->
  </form>
  ```

### **Required Attributes**

- **Navigation Buttons**:
  - **Previous Button**: `ms-nav="prev"`
  - **Next Button**: `ms-nav="next"`

  ```html
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
  ```

### **Including the Script**

Place the script at the end of your HTML file, just before the closing `</body>` tag.

```html
<script>
  <!-- Paste the full script provided earlier here -->
</script>
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

## **5. Conditional Steps**

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

## **6. Validation Handling**

- **Visible Inputs**: Only inputs in the current visible step are validated.
- **Required Fields**: Required attributes are managed dynamically to prevent validation of hidden fields.
- **Validation Messages**: Standard HTML5 validation messages are used; customize using `title` attributes if needed.

---

## **7. Accessibility Features**

- **ARIA Attributes**: Steps and navigation elements include appropriate ARIA roles and attributes.
- **Focus Management**: The first input in each step is focused when the step is displayed.

---

## **8. API Methods**

The script provides an API accessible via `window.multiStepFormAPI`.

- **`getCurrentStep()`**: Returns the index of the current step.
- **`validateCurrentStep()`**: Validates inputs in the current step.
- **`nextStep()`**: Moves to the next step if validation passes.
- **`prevStep()`**: Moves to the previous step.

**Note**: Forward navigation via `setStep(stepIndex)` is restricted to prevent skipping steps.

---

## **9. Example Implementation**

```html
<!-- Wrapper -->
<div ms="wrapper">
  <!-- Form -->
  <form>
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

    <!-- Step 2: Product Selection -->
    <div ms-step-name="Product Selection">
      <!-- Product selection fields -->
    </div>

    <!-- Step 3: Company Information (Conditional) -->
    <div data-condition="customer == 'company'" ms-step-name="Company Information">
      <!-- Fields for company information -->
    </div>

    <!-- Step 4: Private Information (Conditional) -->
    <div data-condition="customer == 'private'" ms-step-name="Private Information">
      <!-- Fields for private customer information -->
    </div>

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
</div>

<!-- Include the script -->
<script>
  <!-- Paste the full updated script here -->
</script>
```

---

## **10. Best Practices**

- **Consistent Input Names**: Ensure the `name` attributes of inputs match those used in `data-condition`.
- **Avoid Skipping Steps**: Use the script's navigation restrictions to prevent users from skipping required steps.
- **Style Deactivated Steps**: Use the "is-deactive" class to visually indicate steps that are not yet accessible.
- **Test Thoroughly**: Test your form with various inputs to ensure conditional logic and validation work as expected.
- **Accessibility Compliance**: Ensure your styles do not interfere with the ARIA attributes and roles.

---

## **11. Troubleshooting**

- **Steps Not Showing/Hiding Correctly**:
  - Verify `data-condition` syntax and input names.
  - Ensure the `value` attributes in inputs match those used in conditions.

- **Navigation Issues**:
  - Confirm that the navigation elements have the correct attributes (`ms-nav-steps`).
  - Ensure the script is correctly included and no JavaScript errors are present.

- **Validation Errors**:
  - Check that required fields are correctly set and only on visible steps.
  - Make sure validation messages are displaying for the correct inputs.

- **Styles Not Applying**:
  - Verify that the classes `is-active` and `is-deactive` are correctly used in your CSS.

---

## **12. Conclusion**

By following this guide, you can effectively implement a multistep form with conditional logic and restricted forward navigation. The script ensures users complete all required steps in order, enhancing data integrity and user experience.
