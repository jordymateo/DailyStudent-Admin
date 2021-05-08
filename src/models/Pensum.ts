export type Pensum = {
  id: number;
  name: string;
  path: string;
  carrerId: number;
  careerName: string;
  institutionName: string;
  creationDate: Date;
  isApproved: boolean;
  isDeleted: boolean;
  creditLimitPerPeriod: number;
  state: string;
}