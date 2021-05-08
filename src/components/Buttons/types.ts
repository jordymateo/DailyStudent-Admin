import { IButtonOptions } from "devextreme-react/button";

export interface ILoadingButtonOptions extends IButtonOptions {
    loading: boolean;
    loadingText: string;
}