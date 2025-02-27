import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const [userdata, setUserdata] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_LINK}/auth/logged`, {
        withCredentials: true,
      });
      setUserdata(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userdata, setUserdata }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
