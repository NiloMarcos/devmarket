export type FormValues = {
  id?: string;
  name: string;
  unitMeasurement: string;
  amount: number;
  perishable: boolean;
  price: string;
  expirationDate: string;
  dateManufacture: string;
};

export interface Items {
  id?: string;
  name: string;
  price: string;
  unitMeasurement: string;
  amount: string;
  perishable: string;
  expirationDate: string;
  dateManufacture: string;
}
