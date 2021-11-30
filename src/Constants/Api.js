import axios from "axios";

const APIServer = "http://localhost:8080/api"

const headers = {}
const APIRequest = axios.create({
    baseURL:APIServer,
    headers,
    withCredentials: false,
});
APIRequest.interceptors.request.use(
    (config) => {
      document.getElementById('root').setAttribute("data-state", "loading")
      return config;
    });
    APIRequest.interceptors.response.use(
    (response) => {
      document.getElementById('root').removeAttribute("data-state");
      return response;
    },
    (error) => {
      document.getElementById('root').removeAttribute("data-state");
      window.throwNotification(`Ooups une erreur s'est produite. Veuillez réessayer plus tard`);
    });
export default APIRequest;