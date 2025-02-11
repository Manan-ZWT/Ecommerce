import Cookie from "js-cookie";

export const logout = () => {
  Cookie.remove("token");
  Cookie.remove("userdata");
  window.location.reload();
};
