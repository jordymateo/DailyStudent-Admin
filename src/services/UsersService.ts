import { Signup, User } from "../models";
import AxiosClient from "./AxiosClient";

const UsersService = (() => {

  return ({
    getStudents() {
      return new Promise<User[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/account/students`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    getAdmins() {
      return new Promise<User[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/account/admins`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    toggleState(userId: number) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .put(`/api/account/toggleState/${userId}`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    signUpAdmin(user: Signup) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .post(`/api/account/admin/signup`, user)
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

export default UsersService;