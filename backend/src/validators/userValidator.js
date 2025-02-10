// IMPORTING YUP FOR DATA VALIDATION
import yup from "yup";

// SCHEMA FOR VALIDATING USER DATA WHEN CREATING NEW USER FOR "users" TABLE
export const registerNewUserSchema = yup.object({
  first_name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z]+$/, "Name must only contain alphabets"),
  last_name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z]+$/, "Name must only contain alphabets"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      "Password must contain at least one lowecase character, one uppercase character, one digit and one special character"
    ),
  role: yup
    .string()
    .transform((value) => value && value.toLowerCase())
    .oneOf(["admin", "customer"], "Not a valid role, enter a valid role")
    .required("Role is required"),
});

export const loginUserSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      "Password must contain at least one lowecase character, one uppercase character, one digit and one special character"
    ),
});

// SCHEMA FOR VALIDATING USER DATA WHEN UPDATING EXISTING USER FOR "users" TABLE
export const userUpdateSchema = yup.object({
  first_name: yup
    .string()
    .optional()
    .min(2, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name must only contain alphabets and spaces"),
  last_name: yup
    .string()
    .optional()
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name must only contain alphabets and spaces"),
  email: yup
    .string()
    .optional()
    .email("Invalid email format"),
  password: yup
    .string()
    .optional()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      "Password must contain at least one lowecase character, one uppercase character, one digit and one special character"
    ),
});



// SCHEMA FOR VALIDATING USER FORM DATA FOR "user_forms" TABLE
export const userFormSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name must only contain alphabets and spaces"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
});
