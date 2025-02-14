// IMPORTING YUP FOR DATA VALIDATION
import yup from "yup";

// SCHEMA FOR VALIDATING PRODUCT DATA WHEN CREATING NEW PRODUCT FOR "products" TABLE
export const createNewProductSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      "Name must only contain alphabets, spaces, numbers and special characters"
    ),
  description: yup.string().optional(),
  price: yup.number("Enter a number in price").required("Price is required"),
  stock: yup.number("Enter a number in stock").optional(),
  category_id: yup.number("Enter a valid number").required(),
  image_url: yup.string().optional(),
});

export const updateProductSchema = yup.object({
  name: yup
    .string()
    .notRequired()
    .matches(
      /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      "Name must only contain alphabets, spaces, numbers and special characters"
    ),
  description: yup.string().notRequired(),
  price: yup.number("Enter a number in price").notRequired(),
  stock: yup.number("Enter a number in stock").notRequired(),
  category_id: yup.number("Enter a valid number").notRequired(),
  image_url: yup.string().notRequired(),
});
