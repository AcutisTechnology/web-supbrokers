import { api } from "@/shared/configs/api";

export interface TeamMemberSetting {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Ativo" | "Convite pendente";
}

export interface UserSettingsData {
  profile: {
    job_title: string;
  };
  security: {
    two_factor_enabled: boolean;
  };
  company: {
    trade_name: string | null;
    legal_name: string | null;
    document: string | null;
    creci: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    description: string | null;
    address: {
      street: string | null;
      number: string | null;
      neighborhood: string | null;
      city: string | null;
      state: string | null;
      zip_code: string | null;
    };
    financial: {
      receiving_account: string | null;
      escrow_account: string | null;
      pix_key: string | null;
    };
  };
  team: {
    members: TeamMemberSetting[];
  };
  integrations: {
    canal_pro: { enabled: boolean };
    asaas: { enabled: boolean };
    whatsapp: { enabled: boolean };
    google_calendar: { enabled: boolean };
  };
  automations: {
    send_on_due: boolean;
    auto_charge: boolean;
    days_notice: number;
    days_extrajudicial: number;
    require_approval: boolean;
  };
}

export interface UserSettingsResponse {
  success: boolean;
  data: UserSettingsData;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type UpdateUserSettingsPayload = DeepPartial<UserSettingsData>;

export async function getUserSettings() {
  return api.get("settings").json<UserSettingsResponse>();
}

export async function updateUserSettings(payload: UpdateUserSettingsPayload) {
  return api.put("settings", { json: payload }).json<UserSettingsResponse>();
}
