// IMPORTING YUP FOR DATA VALIDATION
import yup from "yup";

// SCHEMA FOR VALIDATING ORDER STATUS DATA WHEN UPDATING ORDER STATUS
export const updateStatus = yup.object({
  status: yup
    .string()
    .optional()
    .oneOf(
      ["pending", "shipped", "delievered", "canceled"],
      "Not a valid status, enter a valid status"
    )
    .transform((value) => value && value.toLowerCase()),
});
