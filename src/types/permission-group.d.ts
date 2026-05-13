export interface IPermission {
  key: string;
  name: string;
}

export interface IPermissionModule {
  module: string;
  permissions: IPermission[];
}

export interface IPermissionGroup {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
  users_count: number;
  permissions_count: number;
  permissions: IPermission[];
  created_at?: string;
  updated_at?: string;
}

export interface IPermissionGroupListResponse {
  success: boolean;
  data: IPermissionGroup[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface IPermissionGroupFormData {
  name: string;
  description?: string;
  active: boolean;
  permissions: string[];
}
