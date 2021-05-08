import React from 'react';
import Images from '../../assets/images';
import { IAuthLayoutProps } from './types';

const AuthLayout: React.FC<IAuthLayoutProps> = ({children}) => {
    return (
        <div className="body-section">
            <img className="bg-shape-top" src={Images.BgShapeTop} />
            <div className="card-section">
                <div className="banner-section">
                    <img src={Images.Banner} className="banner" />
                </div>
                <div className="form-section">
                    {children}
                </div>
            </div>
            <img className="bg-shape-bottom" src={Images.BgShapeBotton} />
        </div>
    );
}

export default AuthLayout;