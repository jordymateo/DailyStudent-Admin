import { Career, Institution, Pensum, Subject } from "../../models";

export interface ICareersSectionProps {
    tabIndex: number;
    data: Career[];
    institutions: Institution[];
    onDataChanged: () => void;
}

export interface IPensumsSectionProps {
    tabIndex: number;
    data: Pensum[];
    careers: Career[];
    institutions: Institution[];
    onDataChanged: () => void;
}

export type CareerForm = {
    id: number;
    name: string;
    institutionId: number;
    pensum: File[];
}

export type PensumForm = {
    id: number;
    name: string;
    careerId: any;
    creditLimitPerPeriod: number;
    pensum: File[];
}

export interface ICreateCareerProps {
    data?: CareerForm;
    visible: boolean;
    onHidden: () => void;
    onDataChanged: () => void;
}

export interface ICreatePensumProps {
    data?: PensumForm;
    visible: boolean;
    onHidden: () => void;
    onDataChanged: () => void;
}

export interface IGridSubjectsProps {
    subjects?: Subject[];
    onAddMode: () => void;
    //onDataChanged: () => void;
}
