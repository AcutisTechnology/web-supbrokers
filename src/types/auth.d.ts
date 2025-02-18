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
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}
