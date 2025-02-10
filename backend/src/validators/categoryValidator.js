
// IMPORTING YUP FOR DATA VALIDATION
import yup from "yup";

// SCHEMA FOR VALIDATING USER DATA WHEN CREATING NEW CATEGORY FOR "categories" TABLE
export const addCategory = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      "Name must only contain alphabets, spaces, numbers and special characters"
    ),
});
