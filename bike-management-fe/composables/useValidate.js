export const notEmpty = (value) => {
  value = value && typeof value === "object" ? [...value] : value;
  return !!value?.length || "Please Input Value";
};

export const positiveNumber = (value) =>
  value >= 0 || "Please Input Positive Value";

export const notEqual = (compareValue) => (value) => {
  return value === compareValue || `Value is not matched`;
};

export const minLength = (minLength) => (value) => {
  return (
    value.length >= minLength || `Please input at least ${minLength} characters`
  );
};

export const isEmail = (value) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return value.match(regex) || "Please Input Valid Email";
};

export const isPhoneNumber = (value) => {
  const regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return value.match(regex) || "Please Input Valid Phone Number";
};

export const isValidNewPassword = (newPassword) => (currentPassword) => {
  return (
    newPassword !== currentPassword ||
    "New password is same as current password"
  );
};
