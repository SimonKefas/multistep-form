# **Multistep Form with Conditional Logic, Validation, and Custom Keyboard Navigation**

This guide provides comprehensive instructions to implement a multistep form with conditional steps, validation, custom keyboard navigation, and progress indicators. The script enhances user experience by guiding them through the form step-by-step, ensuring data integrity, and providing visual progress feedback.

---

## **Features**

- **Multistep Navigation**: Break down long forms into manageable steps.
- **Custom Step Definition**: Only elements with `ms-step` are treated as steps, giving you full control.
- **Conditional Logic**: Show or hide steps based on user input.
- **Form Validation**: Validate inputs at each step before proceeding.
- **Custom Keyboard Navigation**: Navigate using customizable key combinations.
- **Progress Bar**: Visual indicator of form completion.
- **Accessible**: ARIA roles and attributes for better accessibility.
- **Easy Integration**: Simple HTML attributes to enable features.
- **Compatible with Webflow**: Works seamlessly with Webflow forms.

---

## **Quick Setup Guide**

### **1. Include the Script**

Add the following script before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

### **2. HTML Structure**

#### **Wrapper**

Wrap your form inside a container with `ms="wrapper"`:

```html
<div ms="wrapper">
  <!-- Form goes here -->
</div>
```

#### **Form Element**

Use a standard `<form>` element. Add `ms-keyboard-nav` if you want keyboard navigation:

```html
<form ms-keyboard-nav action="/submit-form" method="POST">
  <!-- Steps go here -->
</form>
```

**Note**: By default, keyboard navigation uses **Shift+Enter** to go to the next step and **Alt+Enter** to go to the previous step.

### **3. Defining Form Steps**

Only elements within the `<form>` that have the `ms-step` attribute are considered steps.

#### **Form Steps**

Each step is an element (e.g., `<div>`, `<section>`) inside the `<form>` with the `ms-step` attribute:

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

- **`ms-step` Attribute**: Marks the element as a step in the multistep form.
- **`ms-step-name` Attribute** (Optional): Provides a custom name for the step, used in navigation and progress indicators.

#### **Non-Step Elements**

You can include other elements within the form that are not steps, such as hidden inputs, summary sections, or additional form controls. These elements will not be affected by the multistep functionality.

#### **Conditional Steps**

Show or hide steps based on user input using `data-condition`:

```html
<div ms-step data-condition="inputName == 'value'" ms-step-name="Conditional Step">
  <!-- Content for conditional step -->
</div>
```

**Example:**

```html
<!-- User selects customer type -->
<label>
  <input type="radio" name="customerType" value="individual" required>
  Individual
</label>
<label>
  <input type="radio" name="customerType" value="business">
  Business
</label>

<!-- Conditional step for business customers -->
<div ms-step data-condition="customerType == 'business'" ms-step-name="Business Details">
  <!-- Business-specific fields -->
</div>
```

### **4. Navigation Buttons**

Add Previous and Next buttons with the following attributes:

```html
<button type="button" ms-nav="prev">Previous</button>
<button type="button" ms-nav="next">Next</button>
```

- **Placement**: Buttons can be placed inside or outside the form, as needed.

### **5. Progress Bar (Optional)**

Add progress indicators anywhere inside the wrapper:

```html
<!-- Progress Bar -->
<div ms-progress-wrap>
  <div ms-progress-bar></div>
</div>

<!-- Step Indicators -->
<p>
  Step <span ms-current-step></span> of <span ms-total-steps></span>
</p>
```

### **6. Success Message (Optional)**

Use your platform's built-in success message (e.g., Webflow's success message). The script hides navigation elements upon form submission to display the success message without interference.

---

## **Custom Keyboard Navigation**

### **Enabling Keyboard Navigation**

Add the `ms-keyboard-nav` attribute to your `<form>` element to enable keyboard navigation. You can also customize the key combinations for navigation using `data-next-key` and `data-prev-key`.

```html
<form ms-keyboard-nav data-next-key="Shift+Enter" data-prev-key="Alt+Enter">
  <!-- Form steps -->
</form>
```

- **Default Key Combinations**:
  - **Next Step**: **Shift+Enter**
  - **Previous Step**: **Alt+Enter**

### **Usage**

- **Proceed to Next Step**: Press **Shift+Enter**.
- **Go to Previous Step**: Press **Alt+Enter**.
- **Submit the Form**: Press **Enter** on the last step (after all validations pass).

### **Customizing Key Combinations**

You can customize the key combinations by setting `data-next-key` and `data-prev-key` attributes on the `<form>` element.

- **Example**:

  ```html
  <form ms-keyboard-nav data-next-key="Ctrl+ArrowRight" data-prev-key="Ctrl+ArrowLeft">
    <!-- Form steps -->
  </form>
  ```

  - **Next Step**: **Ctrl+ArrowRight**
  - **Previous Step**: **Ctrl+ArrowLeft**

### **Notes**

- **Preventing Default Submission**: The script prevents the default form submission when **Enter** is pressed, except when on the last step and all validations pass.
- **Textarea Inputs**: The script allows normal behavior in `<textarea>` fields, so users can press **Enter** to create new lines.
- **Accessibility Considerations**: Ensure that your chosen key combinations do not conflict with screen readers or other assistive technologies.

---

## **Styling**

### **Progress Bar Styles**

Customize the progress bar using CSS:

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
  background-color: #3b82f6; /* Adjust color */
  transition: width 0.3s ease;
}
```

### **Navigation Steps (Optional)**

If using navigation steps, style the active and deactivated steps:

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

## **Complete Example**

```html
<!-- Wrapper -->
<div ms="wrapper">
  <!-- Progress Bar -->
  <div ms-progress-wrap>
    <div ms-progress-bar></div>
  </div>
  <p>Step <span ms-current-step></span> of <span ms-total-steps></span></p>

  <!-- Form -->
  <form ms-keyboard-nav data-next-key="Shift+Enter" data-prev-key="Alt+Enter" action="/submit-form" method="POST">
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

    <!-- Step 2 (Conditional) -->
    <div ms-step data-condition="customerType == 'business'" ms-step-name="Business Details">
      <!-- Business-specific fields -->
    </div>

    <!-- Step 3 -->
    <div ms-step ms-step-name="Contact Information">
      <!-- Contact fields -->
    </div>

    <!-- Submit Button -->
    <button type="submit">Submit</button>
  </form>

  <!-- Navigation Buttons -->
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>

<!-- Include the script -->
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

---

## **Key Points**

- **Custom Step Definition**: Only elements with `ms-step` are considered steps, providing flexibility in form design.
- **Validation**: The script validates inputs in the current step before allowing navigation.
- **Conditional Logic**: Steps with `data-condition` attributes are shown or hidden based on user input.
- **Preventing Premature Submission**: The default Enter key behavior is managed to prevent unintended form submissions.
- **Custom Keyboard Navigation**: Use customizable key combinations for next and previous step navigation.
- **Accessibility**: The script includes ARIA roles and manages focus for better accessibility.
- **No AJAX Submission**: The form submits naturally, ensuring compatibility with platforms like Webflow.

---

## **Best Practices**

- **Defining Steps**: Ensure that all your step elements within the form have the `ms-step` attribute.
- **Input Names**: Ensure input `name` attributes match those used in `data-condition`.
- **Required Fields**: Use the `required` attribute for mandatory fields.
- **Testing**: Test the form thoroughly to ensure all steps and validations work as expected.
- **Customization**: Feel free to style the form and progress indicators to match your branding.
- **Accessibility**: Choose keyboard shortcuts that do not interfere with assistive technologies.

---

## **Troubleshooting**

- **Form Not Submitting**: Ensure all required fields are filled and valid. Remember that pressing **Enter** will only submit the form on the last step.
- **Steps Not Showing/Hiding**: Check `data-condition` syntax and input values.
- **Keyboard Navigation Not Working**: Ensure `ms-keyboard-nav` is added to the `<form>` and that key combinations are correctly specified.
- **Progress Bar Not Updating**: Verify that `[ms-progress-wrap]` and `[ms-progress-bar]` are correctly included.
- **Default Enter Key Behavior**: The script prevents default form submission when **Enter** is pressed. If you need to allow submissions via Enter key in specific cases, adjust the script accordingly.
- **Autofocus Issues**: The script is designed not to autofocus on page load or when steps change automatically. Autofocus occurs only when the user navigates steps using the navigation buttons or keyboard shortcuts.

---

## **Additional Information**

- **Compatible Platforms**: The script is designed to work with standard HTML forms and platforms like Webflow.
- **Further Customization**: Advanced users can modify the script or styles to add more features or change behaviors.
- **Support**: If you encounter issues or have questions, feel free to reach out for assistance.

---

Thank you for choosing this multistep form solution to enhance your forms. Happy coding!

---

**Note**: Always ensure that any custom key combinations used do not conflict with browser shortcuts or accessibility features. It's important to test your form with various assistive technologies to ensure it remains accessible to all users.

---