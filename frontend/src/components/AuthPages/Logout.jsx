import axios from "axios";
import { useUser } from "../../Context/UserContext";

export const useLogout = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const { setUserdata } = useUser();
  const logout = async () => {
    try {
      const response = await axios.post(
        `${API_LINK}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.message === "User logout succesful") {
        setUserdata({});
        window.location.href = "/";
      }
    } catch (err) {
      console.log("Logout failed:", err.response?.data?.error);
    }
  };
  return logout;
};
