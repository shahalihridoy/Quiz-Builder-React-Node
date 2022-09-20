import { API_BASE_URL } from "@shared/constants";
import _axios, { AxiosRequestConfig, AxiosResponse } from "axios";

class API {
  private static axios = _axios.create({
    baseURL: API_BASE_URL,
  });

  public static setHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.axios.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  };

  public static get = async <T>(
    url: string,
    config?: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse<T>> => {
    API.setHeader();
    return API.axios.get(url, config);
  };

  public static post = async <T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse<T>> => {
    this.setHeader();
    return API.axios.post(url, data, config);
  };

  public static put = async <T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse<T>> => {
    this.setHeader();
    return API.axios.put(url, data, config);
  };

  public static delete = async <T>(
    url: string,
    config?: AxiosRequestConfig | undefined
  ): Promise<AxiosResponse<T>> => {
    this.setHeader();
    return API.axios.delete(url, config);
  };
}

export default API;
