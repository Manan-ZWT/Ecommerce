import Cookie from "js-cookie";

export const logout = () => {
  Cookie.remove("token");
  Cookie.remove("userdata");
  window.location.href = "/";
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
