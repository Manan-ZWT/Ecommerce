import { Link } from "react-router-dom";
import "./AdminNavBar.css";
export const AdminNavBar = () => {
  return (
    <>
      <div className="navbar">
        <ul>
          <li>
            <Link to="/Category">Add Category</Link>
          </li>
          <li>
            <Link to="/addproduct">Add Product</Link>
          </li>
          <li>
            <Link to="/updatestatus">Update Order Status</Link>
          </li>
        </ul>
      </div>
    </>
  );
};
