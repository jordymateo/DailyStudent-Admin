import { User } from "../../models";

export interface IStudentsSectionProps {
    tabIndex: number;
    data: User[];
    onDataChanged: () => void;
}

export interface IAdminSectionProps {
    tabIndex: number;
    data: User[];
    onDataChanged: () => void;
}

export interface ICreateAdminProps {
    visible: boolean;
    onHidden: () => void;
    onDataChanged: () => void;
}

export interface IUserModel {
    name: string;
    lastName: string;
    password: string;
    email: string
}