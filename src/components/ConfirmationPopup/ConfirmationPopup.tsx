import React from 'react';
import { Popup, Button } from 'devextreme-react';
import { IConfirmationPopupProps } from './types';

const ConfirmationPopup: React.FC<IConfirmationPopupProps> = ({ open, okText, cancelText, message, onOk, onCancel }) => (
    <Popup
        visible={open}
        onHiding={onCancel}
        dragEnabled={false}
        showCloseButton={false}
        closeOnOutsideClick={false}
        shadingColor="rgba(0,0,0, 0.4)"
        showTitle={true}
        title={'Confirmación'}
        width={400}
        height={220}
    >
        <div className="confirmation-popup">
            <label className="confirmation-popup-message">{message}</label>

            <Button
                text={cancelText}
                className="btn-secondary blue"
                width="80px"
                height="40px"
                style={{marginRight: '20px'}}
                stylingMode={'text'}
                type="normal"
                onClick={onCancel}
            />

            <Button
                text={okText}
                className="btn-contained"
                width="90px"
                height="40px"
                stylingMode={'contained'}
                type="normal"
                onClick={onOk}
            />
        </div>
    </Popup>
);

export default ConfirmationPopup;