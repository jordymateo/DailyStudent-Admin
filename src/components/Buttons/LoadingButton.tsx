import React from 'react';
import { Button, LoadIndicator } from 'devextreme-react';
import { ILoadingButtonOptions } from './types';
import Images from '../../assets/images';

const LoadingButton: React.FC<ILoadingButtonOptions> = ({ loading, text, disabled, className, loadingText, ...buttonOptions }) => {
    var classNameArr: string[] = ['loading-button'];
    if (className) classNameArr.push(className);
    return (
        <Button
            className={classNameArr.join(' ')}
            disabled={loading}
            {...buttonOptions}
        >
            <LoadIndicator
                className={'loading-button-indicator'}
                indicatorSrc={Images.Loading}
                visible={loading}
            />
            <span style={{ marginLeft: '5px' }} className={'dx-button-text'}>{loading ? loadingText : text }</span>
        </Button>

    );
};

export default LoadingButton;
