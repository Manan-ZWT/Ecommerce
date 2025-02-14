import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../HomePage/Product";
import { AddCategory } from "./AddCategoryForm";
import { AddProduct } from "./AddProductForm";
export const AdminNavBar = () => {
  const [form, showForm] = useState("");

  const showCategoryForm = () => {
    showForm("categoryForm");
  };

  const showAddProductForm = () => {
    showForm("addProductForm");
  };

  return (
    <>
      <ul>
        <li>
          <button onClick={showCategoryForm}>Add Category</button>
        </li>
        <li>
          <button onClick={showAddProductForm}>Add Product</button>
        </li>
      </ul>

      {form === "categoryForm" && <AddCategory />}
      {form === "addProductForm" && <AddProduct />}
    </>
  );
};
