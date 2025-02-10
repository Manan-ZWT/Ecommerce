// IMPORTING YUP FOR DATA VALIDATION
import yup from "yup";

export const addtoCart = yup.object({
  product_id: yup
    .number("Product id should be number")
    .required("Product id is required"),

  quantity: yup.number("Quantity should be number").optional(),
});
