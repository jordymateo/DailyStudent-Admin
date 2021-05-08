import { Career } from "../models";
import AxiosClient from "./AxiosClient";

const CareersService = (() => {

  return ({
    getAll() {
      return new Promise<Career[]>((resolve, reject) => {
        AxiosClient
          .get('/api/careers')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    create(model: FormData) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .post('/api/careers', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    update(model: FormData) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put('/api/careers', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    approve(careerId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put(`/api/careers/approve/${careerId}`, null)
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

export default CareersService;