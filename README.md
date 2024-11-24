# **Multistep Form with Conditional Logic, Validation, and Custom Keyboard Navigation**

This guide provides comprehensive instructions to implement one or more multistep forms on the same page, with features like conditional steps, validation, custom keyboard navigation, progress indicators, and more. The script enhances user experience by guiding them through the form step-by-step, ensuring data integrity, and providing visual progress feedback.

---

## **Features**

- **Multistep Navigation**: Break down long forms into manageable steps.
- **Multiple Forms Support**: Have multiple multistep forms on the same page.
- **Custom Step Definition**: Only elements with `ms-step` are treated as steps, giving you full control.
- **Conditional Logic**: Show or hide steps based on user input.
- **Form Validation**: Validate inputs at each step before proceeding.
- **Custom Keyboard Navigation**: Navigate using customizable key combinations.
- **Progress Bar**: Visual indicator of form completion.
- **Visual Dividers Removal**: Automatically removes elements with `ms-step-divider` attribute.
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

**Note**: You only need to include the script once, even if you have multiple multistep forms on the page.

### **2. HTML Structure**

#### **Wrapper**

Wrap each multistep form inside a separate container with `ms="wrapper"`:

```html
<div ms="wrapper">
  <!-- First multistep form goes here -->
</div>

<!-- You can have other content or forms here -->

<div ms="wrapper">
  <!-- Second multistep form goes here -->
</div>
```

#### **Form Element**

Use a standard `<form>` element inside each wrapper. Add `ms-keyboard-nav` if you want keyboard navigation:

```html
<form ms-keyboard-nav action="/submit-form" method="POST">
  <!-- Steps and other elements go here -->
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

### **4. Visual Dividers**

If you wish to include visual dividers between steps in your HTML but have them removed from the live form (e.g., for template purposes), you can use the `ms-step-divider` attribute.

```html
<div ms-step-divider>
  <!-- Divider content (e.g., horizontal line, graphic) -->
</div>
```

**Note**: The script will automatically remove elements with the `ms-step-divider` attribute from the DOM upon initialization.

### **5. Navigation Buttons**

Add Previous and Next buttons with the following attributes inside each wrapper:

```html
<button type="button" ms-nav="prev">Previous</button>
<button type="button" ms-nav="next">Next</button>
```

- **Placement**: Buttons should be placed within the `ms="wrapper"` container of their respective forms.

### **6. Progress Bar (Optional)**

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

### **7. Success Message (Optional)**

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

## **Implementing Multiple Multistep Forms**

To use multiple multistep forms on the same page:

1. **Wrap Each Form Separately**:

   - Each multistep form should be wrapped inside a container with the `ms="wrapper"` attribute.

   ```html
   <div ms="wrapper">
     <!-- First multistep form -->
     <form ms-keyboard-nav data-next-key="Shift+Enter" data-prev-key="Alt+Enter">
       <!-- Steps and other elements -->
     </form>
     <!-- Navigation Buttons -->
     <button type="button" ms-nav="prev">Previous</button>
     <button type="button" ms-nav="next">Next</button>
   </div>

   <!-- Other content or forms -->

   <div ms="wrapper">
     <!-- Second multistep form -->
     <form ms-keyboard-nav data-next-key="Shift+Enter" data-prev-key="Alt+Enter">
       <!-- Steps and other elements -->
     </form>
     <!-- Navigation Buttons -->
     <button type="button" ms-nav="prev">Previous</button>
     <button type="button" ms-nav="next">Next</button>
   </div>
   ```

2. **Unique Elements Within Each Wrapper**:

   - Ensure that all elements with `ms-` attributes (e.g., `[ms-nav="prev"]`, `[ms-step]`, `[ms-progress-wrap]`) are within their respective wrappers.
   - This ensures that each form instance operates independently.

3. **Include the Script Once**:

   - You only need to include the script once at the end of the body.
   - The script will automatically initialize all multistep forms on the page.

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
<!-- First Multistep Form -->
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

    <!-- Divider (Will be removed by the script) -->
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

    <!-- Submit Button -->
    <button type="submit">Submit</button>
  </form>

  <!-- Navigation Buttons -->
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>

<!-- Other content or forms -->

<!-- Second Multistep Form -->
<div ms="wrapper">
  <!-- Progress Bar -->
  <div ms-progress-wrap>
    <div ms-progress-bar></div>
  </div>
  <p>Step <span ms-current-step></span> of <span ms-total-steps></span></p>

  <!-- Form -->
  <form ms-keyboard-nav action="/another-submit" method="POST">
    <!-- Steps -->
    <div ms-step ms-step-name="Step A">
      <!-- Step A content -->
    </div>
    <div ms-step ms-step-name="Step B">
      <!-- Step B content -->
    </div>
    <!-- Submit Button -->
    <button type="submit">Submit</button>
  </form>

  <!-- Navigation Buttons -->
  <button type="button" ms-nav="prev">Previous</button>
  <button type="button" ms-nav="next">Next</button>
</div>

<!-- Include the script once -->
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/multistep-form@latest/js/script.js"></script>
```

---

## **Key Points**

- **Custom Step Definition**: Only elements with `ms-step` are considered steps, providing flexibility in form design.
- **Multiple Forms Support**: You can have multiple multistep forms on the same page, each operating independently.
- **Visual Dividers Removal**: Elements with the `ms-step-divider` attribute are automatically removed from the DOM, allowing you to include them in your HTML for template purposes without affecting the live form.
- **Validation**: The script validates inputs in the current step before allowing navigation.
- **Conditional Logic**: Steps with `data-condition` attributes are shown or hidden based on user input.
- **Preventing Premature Submission**: The default Enter key behavior is managed to prevent unintended form submissions.
- **Custom Keyboard Navigation**: Use customizable key combinations for next and previous step navigation.
- **Accessibility**: The script includes ARIA roles and manages focus for better accessibility.
- **No AJAX Submission**: The form submits naturally, ensuring compatibility with platforms like Webflow.

---

## **Best Practices**

- **Defining Steps**: Ensure that all your step elements within the form have the `ms-step` attribute.
- **Using Dividers**: If you include visual dividers with the `ms-step-divider` attribute, be aware that they will be removed from the live form.
- **Input Names**: Ensure input `name` attributes match those used in `data-condition`.
- **Required Fields**: Use the `required` attribute for mandatory fields.
- **Testing**: Test the form thoroughly to ensure all steps and validations work as expected.
- **Customization**: Feel free to style the form and progress indicators to match your branding.
- **Accessibility**: Choose keyboard shortcuts that do not interfere with assistive technologies.
- **Unique Scoping**: Make sure all `ms-` attributes are correctly scoped within each `ms="wrapper"` container to prevent conflicts.

---

## **Troubleshooting**

- **Form Not Submitting**: Ensure all required fields are filled and valid. Remember that pressing **Enter** will only submit the form on the last step.
- **Steps Not Showing/Hiding**: Check `data-condition` syntax and input values.
- **Keyboard Navigation Not Working**: Ensure `ms-keyboard-nav` is added to the `<form>` and that key combinations are correctly specified.
- **Progress Bar Not Updating**: Verify that `[ms-progress-wrap]` and `[ms-progress-bar]` are correctly included within the wrapper.
- **Default Enter Key Behavior**: The script prevents default form submission when **Enter** is pressed. If you need to allow submissions via Enter key in specific cases, adjust the script accordingly.
- **Autofocus Issues**: The script is designed not to autofocus on page load or when steps change automatically. Autofocus occurs only when the user navigates steps using the navigation buttons or keyboard shortcuts.
- **Dividers Still Visible**: If elements with `ms-step-divider` are still visible, ensure that the script is correctly included and that there are no JavaScript errors preventing it from running.
- **Multiple Forms Interference**: If forms are interfering with each other, check that all `ms-` attributes are properly scoped within their respective `ms="wrapper"` containers.

---

## **Performance, Scalability, and Accessibility Considerations**

- **Performance**:
  - The script uses debouncing and efficient event handling to minimize performance impacts.
  - Only elements within each multistep form are manipulated, preventing unnecessary DOM operations.
- **Scalability**:
  - The modular design allows for multiple forms without code duplication or conflicts.
  - The script automatically initializes all multistep forms on the page.
- **Accessibility**:
  - ARIA roles and attributes are used to enhance accessibility.
  - Focus management ensures users can navigate using keyboard or assistive technologies.
  - Custom keyboard navigation considers common accessibility practices.

---

## **Additional Information**

- **Compatible Platforms**: The script is designed to work with standard HTML forms and platforms like Webflow.
- **Further Customization**: Advanced users can modify the script or styles to add more features or change behaviors.
- **Support**: If you encounter issues or have questions, feel free to reach out for assistance.

---

## **Conclusion**

By following this guide, you can implement one or more multistep forms on your page, enhancing user experience through guided navigation, validation, and visual feedback. The script is designed to be flexible, efficient, and accessible, ensuring it meets the needs of various projects.

---

**Note**: Always ensure that any custom key combinations used do not conflict with browser shortcuts or accessibility features. It's important to test your form with various assistive technologies to ensure it remains accessible to all users.

---

**Happy coding!**