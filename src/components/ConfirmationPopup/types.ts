export interface IConfirmationPopupProps {
    open: boolean,
    cancelText: string,
    okText: string,
    message: string,
    onCancel: (e: any) => void,
    onOk: (e: any) => void
}