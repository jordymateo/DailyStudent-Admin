import axios from "axios";

const AxiosClient = (() => {
    const tokenIdentifier = 'token';

    const deleteToken = () =>
        localStorage.removeItem(tokenIdentifier);

    const axiosInstance = axios.create({
        baseURL: `${process.env.REACT_APP_URL_PATH}`
    });

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(tokenIdentifier)}`;
    axiosInstance.interceptors.response.use(function (response: any) {
        return response;
    }, function (error: any) {
        if (error.response && error.response.status === 401) {
            deleteToken();
            window.location.replace('/sign_in');
        }

        return Promise.reject(error);
    });


    return ({
        getToken() {
            return localStorage.getItem(tokenIdentifier);
        },
        deleteToken,
        storeToken(tk: string) {
            localStorage.setItem(tokenIdentifier, tk);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tk}`;
        },
        get<t>(url: any): Promise<t> {
            return new Promise<t>((resolve, reject) => {
                axiosInstance
                    .get(url)
                    .then((res: any) => {
                        const result = res.data;
                        resolve(result);
                    })
                    .catch((err: any) => {
                        //TODO: reject(new ErrorResult(err));
                        reject(err);
                    });
            });
        },
        post<t>(url: any, data: any): Promise<t> {
            return new Promise<t>((resolve, reject) => {
                axiosInstance
                    .post(url, data)
                    .then((res: any) => {
                        const result = res.data;
                        resolve(result);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            });
        },
        put<t>(url: any, data: any): Promise<t> {
            return new Promise<t>((resolve, reject) => {
                axiosInstance
                    .put(url, data)
                    .then((res: any) => {
                        const result = res.data;
                        resolve(result);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            });
        },
        delete<t>(url: any, data: any): Promise<t> {
            return new Promise<t>((resolve, reject) => {
                axiosInstance
                    .delete(url, data)
                    .then((res: any) => {
                        const result = res.data;
                        resolve(result);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            });
        },
        anonymousPost<t>(url: any, data: any): Promise<t> {
            return new Promise<t>((resolve, reject) => {
                axios
                    .post(process.env.REACT_APP_URL_PATH + url, data)
                    .then((res: any) => {
                        const result = res.data;
                        resolve(result);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            });
        },
        anonymousPut<t>(url: any, data: any): Promise<t> {
            return new Promise<t>((resolve, reject) => {
                axios
                    .put(process.env.REACT_APP_URL_PATH + url, data)
                    .then((res: any) => {
                        const result = res.data;
                        resolve(result);
                    })
                    .catch((err: any) => {
                        reject(err);
                    });
            });
        }
    });
})();

export default AxiosClient;
