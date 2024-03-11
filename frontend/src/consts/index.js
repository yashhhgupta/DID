export const BASE_URL = "http://localhost:5000";

export const customStyles = {
  control: (provided) => ({
    ...provided,
    background: "var(--color-input)",
    display: "flex",
    flexWrap: "nowrap",
    height:"56px"
  }),
  menu: (provided) => ({
    ...provided,
    background: "var(--color-input)",
  }),
};