// IMPORTING YUP FOR DATA VALIDATION
import yup from "yup";

export const addToWishlist = yup.object({
  product_id: yup
    .number("Product id should be number")
    .required("Product id is required"),
});
