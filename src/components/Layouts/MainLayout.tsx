import React from 'react';
import { Button } from 'devextreme-react';
import Images from '../../assets/images';
import { Sidebar } from '../side-bar/Sidebar';
import { IMainLayoutProps } from './types';

const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
    return (
        <div className="main-section">
            <Sidebar />
            <div className="main-container">
                {children}
            </div>
        </div>
    );
}

export default MainLayout;