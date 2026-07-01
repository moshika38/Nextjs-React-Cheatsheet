# Bio Data Form Example

This folder contains a simple Next.js client component that demonstrates a bio data entry form with state management and inline validation.

## Overview

The form collects:
- Full name
- Date of birth
- Gender
- Email address

It shows inline error messages for missing values and prevents submission until all fields are filled.

## File Structure

```text
forms/
├── app/
│   └── page.tsx      # Bio Data form component
├── package.json      # Next.js app config
└── README.md         # This documentation file
```

## Key Features

- Uses `useState` to manage `formData` and `errors`
- Each input field updates the form state on change
- Validation runs on submit and displays errors next to fields
- Form submission is blocked until the form is valid

## Implementation Details

### Form state setup

```tsx
const [formData, setFormData] = useState({
  fullName: "",
  dateOfBirth: "",
  gender: "",
  email: ""
});

const [errors, setErrors] = useState({
  nameError: "",
  dobError: "",
  genderError: "",
  emailError: ""
});
```

### Validation logic

```tsx
const validate = () => {
  const newErrors = {
    nameError: "",
    dobError: "",
    genderError: "",
    emailError: ""
  };

  if (formData.fullName.trim() === "") {
    newErrors.nameError = "Please enter your full name";
  }

  if (formData.dateOfBirth === "") {
    newErrors.dobError = "Please enter your date of birth";
  }

  if (formData.gender === "") {
    newErrors.genderError = "Please select your gender";
  }

  if (formData.email.trim() === "") {
    newErrors.emailError = "Please enter your email address";
  }

  setErrors(newErrors);
  return Object.values(newErrors).every((error) => error === "");
};
```

### Form submission handler

```tsx
const handleSubmitForm = () => {
  if (!validate()) {
    return;
  }

  // form submite login

  console.log(formData);
  alert("Form Submitted");
};
```

### Form | input 

```tsx
<input
  type="date"
  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
/>
```


## Display erros
```tsx
{errors.dobError && <span className="text-xs text-red-500 font-medium">{errors.dobError}</span>}
```


## Submit | Form
```tsx
<button onClick={handleSubmitForm} >
  Save Bio Data
</button>
```

---