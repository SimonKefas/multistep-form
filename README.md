# **Multistep Form with Conditional Logic, Validation, and Progress Indicators**

This guide provides straightforward instructions to implement a multistep form with conditional steps, validation, keyboard navigation, and progress indicators. The script enhances user experience by guiding them through the form step-by-step, ensuring data integrity, and providing visual progress feedback.

---

## **Features**

- **Multistep Navigation**: Break down long forms into manageable steps.
- **Conditional Logic**: Show or hide steps based on user input.
- **Form Validation**: Validate inputs at each step before proceeding.
- **Keyboard Navigation**: Optional support for navigating with the Enter key.
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

#### **Form Steps**

Each step is a `<div>` inside the `<form>`:

```html
<form>
  <div ms-step-name="Step 1">
    <!-- Step 1 content -->
  </div>
  <div ms-step-name="Step 2">
    <!-- Step 2 content -->
  </div>
  <!-- Additional steps -->
</form>
```

#### **Navigation Buttons**

Add Previous and Next buttons with the following attributes:

```html
<button type="button" ms-nav="prev">Previous</button>
<button type="button" ms-nav="next">Next</button>
```

### **3. Progress Bar (Optional)**

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

### **4. Conditional Steps (Optional)**

Show or hide steps based on user input using `data-condition`:

```html
<div data-condition="inputName == 'value'" ms-step-name="Conditional Step">
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
<div data-condition="customerType == 'business'" ms-step-name="Business Details">
  <!-- Business-specific fields -->
</div>
```

### **5. Success Message (Optional)**

Use your platform's built-in success message (e.g., Webflow's success message). The script hides navigation elements upon form submission to display the success message without interference.

---

## **Keyboard Navigation**

Enable keyboard navigation by adding `ms-keyboard-nav` to the `<form>`:

```html
<form ms-keyboard-nav>
  <!-- Form steps -->
</form>
```

- **Enter Key**: Proceed to the next step.
- **Ctrl+Enter** or **Cmd+Enter**: Submit the form on the last step.

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
  <form ms-keyboard-nav action="/submit-form" method="POST">
    <!-- Step 1 -->
    <div ms-step-name="Customer Type">
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
    <div data-condition="customerType == 'business'" ms-step-name="Business Details">
      <!-- Business-specific fields -->
    </div>

    <!-- Step 3 -->
    <div ms-step-name="Contact Information">
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

- **Validation**: The script validates inputs in the current step before allowing navigation.
- **Conditional Logic**: Steps with `data-condition` attributes are shown or hidden based on user input.
- **Accessibility**: The script includes ARIA roles and manages focus for better accessibility.
- **No AJAX Submission**: The form submits naturally, ensuring compatibility with platforms like Webflow.

---

## **Best Practices**

- **Input Names**: Ensure input `name` attributes match those used in `data-condition`.
- **Required Fields**: Use the `required` attribute for mandatory fields.
- **Testing**: Test the form thoroughly to ensure all steps and validations work as expected.
- **Customization**: Feel free to style the form and progress indicators to match your branding.

---

## **Troubleshooting**

- **Form Not Submitting**: Ensure all required fields are filled and valid.
- **Steps Not Showing/Hiding**: Check `data-condition` syntax and input values.
- **Keyboard Navigation Not Working**: Ensure `ms-keyboard-nav` is added to the `<form>`.
- **Progress Bar Not Updating**: Verify that `[ms-progress-wrap]` and `[ms-progress-bar]` are correctly included.

---

## **Additional Information**

- **Compatible Platforms**: The script is designed to work with standard HTML forms and platforms like Webflow.
- **Further Customization**: Advanced users can modify the script or styles to add more features or change behaviors.
- **Support**: If you encounter issues or have questions, feel free to reach out for assistance.

---

Thank you for choosing this multistep form solution to enhance your forms. Happy coding!