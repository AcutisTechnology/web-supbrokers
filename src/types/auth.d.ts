export interface IAuthenticateUserDTO {
  success: boolean;
  accessToken: string;
  user: IUserDTO;
}

export interface IUserDTO {
  id: number;
  slug?: string;
  name?: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  user_type?: "corretor" | "imobiliaria" | "construtora" | null;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: string[];
  permission_group_id?: number | null;
  permission_group?: {
    id: number;
    name: string;
    description?: string | null;
    active: boolean;
  } | null;
  subscription?: {
    value: number;
    description: string;
    next_due_date: string;
    status: "NO_SUBSCRIPTION" | "FREE_TRIAL" | "ACTIVE";
  };
}
