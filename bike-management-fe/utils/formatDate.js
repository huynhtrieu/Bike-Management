import { format } from "date-fns";

const formatDate = (dateTimeString) => {
  const year = dateTimeString.slice(0, 4);
  const month = dateTimeString.slice(4, 6) - 1; // Subtract 1 since months are zero-based
  const day = dateTimeString.slice(6, 8);
  const hour = dateTimeString.slice(8, 10);
  const minute = dateTimeString.slice(10, 12);
  const second = dateTimeString.slice(12, 14);

  return format(
    new Date(year, month, day, hour, minute, second),
    "dd/MM/yyyy hh:mm:ss"
  );
};

export default formatDate;
