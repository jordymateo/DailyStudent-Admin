import React, { useEffect, useState } from "react";
import { ChangePassword, ChangePassword2, SignIn, Signup, UserContext } from "../models";
import AxiosClient from "./AxiosClient";

const Auth = (() => {

  var token = AxiosClient.getToken();
  var userContext: UserContext = {} as UserContext;
  var isAuthenticated = token !== null && token !== '';

  return {
    userContext,
    isAuthenticated,
    loadUserData() {
      return new Promise<boolean>((resolve, reject) => {
        AxiosClient
          .get('/api/account/info')
          .then((res: any) => {
            this.isAuthenticated = res !== null && res !== '';
            this.userContext = res;
            resolve(true);
          }).catch(err => {
            console.error(err);
            reject(err);
          });

      });
    },
    signIn(formData: SignIn) {
      formData.App = 1; // Admin
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .anonymousPost("/api/account/signin", formData)
          .then((response: any) => {

            const token = response.token;

            this.isAuthenticated = true;
            AxiosClient.storeToken(token);
            resolve(true);
          })
          .catch((error: any) => {
            reject(error.response);
            console.log("ERROR::::", error);
          });
      });
    },
    signUp(formData: FormData) {

      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .anonymousPost("/api/account/SignUp", formData)
          .then((response: any) => {
            resolve(true);
          })
          .catch((error: any) => {
            reject(error.response);
            console.log("ERROR::::", error);
          });
      });
    },
    signOut() {
      return new Promise<any>((resolve, reject) => {
        localStorage.removeItem("token");
        this.isAuthenticated = false;
        resolve(true);
      });
    },
    updateUser(formData: FormData) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .put("/api/account/updateCurrentAccount", formData)
          .then((response: any) => {
            this.userContext = response;
            resolve(true);
          })
          .catch((error: any) => {
            reject(error.response);
            console.log("ERROR::::", error);
          });
      });
    },
    forgotPassword(email: string) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .post(`/api/account/forgotPassword/${email}/1`, null)
          .then((response: any) => {
            resolve(true);
          })
          .catch((error: any) => {
            reject(error.response);
            console.error("ERROR::::", error);
          });
      });
    },
    changePassword(input: ChangePassword2) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .put("/api/account/changePassword", input)
          .then((response: any) => {
            resolve(true);
          })
          .catch((error: any) => {
            reject(error.response);
            console.error("ERROR::::", error);
          });
      });
    },
    changeCurrentPassword(input: ChangePassword) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .put("/api/account/changeCurrentPassword", input)
          .then((response: any) => {
            resolve(true);
          })
          .catch((error: any) => {
            reject(error.response);
            console.error("ERROR::::", error);
          });
      });
    },
    verify(tk: string) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .put(`/api/account/verifyUser/${tk}`, null)
          .then((response: any) => {
            resolve(response);
          })
          .catch((error: any) => {
            reject(error.response);
            console.error("ERROR::::", error);
          });
      })
    }
  }
})();

export default Auth;