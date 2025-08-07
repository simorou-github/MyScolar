import { Permission } from "./permissions";

export interface Role {
  id: number;
  name: string;
  label: string;
  guard_name: string;
  permissions?: Permission[]; 
}