import { Pensum, Subject } from "../models";
import AxiosClient from "./AxiosClient";

const PensumsService = (() => {

  return ({
    get(id: number | string) {
      return new Promise<Pensum>((resolve, reject) => {
        AxiosClient
          .get('/api/pensums/' + id)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    getAll() {
      return new Promise<Pensum[]>((resolve, reject) => {
        AxiosClient
          .get('/api/pensums')
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
          .post('/api/pensums', model)
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
          .put('/api/pensums', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    toggleState(pensumId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put(`/api/pensums/toggleState/${pensumId}`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    approve(pensumId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put(`/api/pensums/approve/${pensumId}`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },

    //Subjects
    getSubjects(pensumId: number) {
      return new Promise<Subject[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/pensums/subjects/${pensumId}`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    createSubject(model: Subject) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .post('/api/pensums/subjects', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    updateSubject(model: Subject) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put('/api/pensums/subjects', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    deleteSubject(subjectId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .delete(`/api/pensums/subjects/${subjectId}`, null)
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

export default PensumsService;