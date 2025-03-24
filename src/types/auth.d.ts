export interface IAuthenticateUserDTO {
  success: boolean;
  accessToken: string;
  user: {
    user: IUserDTO;
  };
}

export interface IUserDTO {
  id: number;
  slug?: string;
  name?: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  subscription?: {
    value: number;
    description: string;
    next_due_date: string;
    status: "NO_SUBSCRIPTION" | "FREE_TRIAL" | "ACTIVE";
  };
}
