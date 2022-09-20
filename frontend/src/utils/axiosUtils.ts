import API from "@services/API";
import { AxiosResponse } from "axios";

export const transformAxiosResponse = ({ data }: AxiosResponse) => data.data;

export const fetcher = <T>(url: string) => {
  return API.get<{ data: T }>(url).then(({ data }) => data?.data);
};

export const defaultQueryFunction = <T>({ queryKey }: any) => {
  return API.get<{ data: T }>(queryKey[0]).then(({ data }) => data?.data);
};

export const getErrorMessage = (error: any) =>
  error.response?.data?.message ?? error.message ?? "Something went wrong";
