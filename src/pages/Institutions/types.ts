import { Institution } from "../../models";

export type InstitutionForm = {
  id: number;
  name: string;
  acronym: string;
  website: string;
  logo: File[];
  countryId: number;
}

export interface IInstitutionsSectionProps {
  //tabIndex: number;
  data: Institution[];
  onDataChanged: () => void;
}

export interface ICreateProps {
  data?: InstitutionForm;
  visible: boolean;
  onHidden: () => void;
  onDataChanged: () => void;
}