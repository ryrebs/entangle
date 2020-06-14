import { differenceInMinutes } from "date-fns";

export const isTimeGreaterThan5min = (date: string) => {
  return differenceInMinutes(Number(date), new Date()) > 5;
};
