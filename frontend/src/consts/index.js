export const BASE_URL = "https://did-backend.onrender.com";
// export const BASE_URL = "http://localhost:5000";

export const customStyles = {
  control: (provided) => ({
    ...provided,
    background: "var(--color-input)",
    display: "flex",
    flexWrap: "nowrap",
    height: "56px",
    minWidth: "400px",
  }),
  menu: (provided) => ({
    ...provided,
    background: "var(--color-input)",
  }),
};