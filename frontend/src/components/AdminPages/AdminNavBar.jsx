import { Link } from "react-router-dom";
export const AdminNavBar = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/Category">Add Category</Link>
        </li>
        <li>
          <Link to="/addproduct">Add Product</Link>
        </li>
      </ul>
    </>
  );
};
