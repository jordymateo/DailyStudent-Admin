import { Country } from "../models";
import AxiosClient from "./AxiosClient";

const CountriesService = (() => {

    return ({
      get() {
        return new Promise<Country[]>((resolve, reject) => {
          AxiosClient
            .get('/api/countries')
            .then((res: any) => {
              resolve(res);
            }).catch(err => {
              console.error(err);
              reject(err.response);
            });
        });
      }
    });
  })();
  
  export default CountriesService;