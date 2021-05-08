import { Institution } from "../models";
import AxiosClient from "./AxiosClient";

const InstitutionsService = (() => {

  return ({
    getAll() {
      return new Promise<Institution[]>((resolve, reject) => {
        AxiosClient
          .get('/api/institutions')
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
          .post('/api/institutions', model)
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
          .put('/api/institutions', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    toggleState(institutionId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put(`/api/institutions/toggleState/${institutionId}`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    approve(institutionId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put(`/api/institutions/approve/${institutionId}`, null)
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

export default InstitutionsService;