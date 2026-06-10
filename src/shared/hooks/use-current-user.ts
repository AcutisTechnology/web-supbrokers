import { useAuth } from "@/shared/hooks/auth/use-auth";
import type { IUserDTO } from "@/types/auth";

export type UserRole = "corretor" | "imobiliaria" | "construtora" | "admin" | "unknown";

export interface CurrentUser {
  user: IUserDTO | null;
  userId: number | null;
  role: UserRole;
  /** Corretor de imóveis — só vê seus próprios leads */
  isBroker: boolean;
  /** Imobiliária ou Administrador — acesso completo à equipe */
  isManager: boolean;
  /** Atalho: user_type === "imobiliaria" */
  isImobiliaria: boolean;
  /** Verifica se o usuário possui uma permissão específica */
  hasPermission: (key: string) => boolean;
}

export function useCurrentUser(): CurrentUser {
  const { user: authData } = useAuth();
  const user = authData?.user ?? null;

  const rawType = user?.user_type ?? null;

  const role: UserRole =
    rawType === "corretor"    ? "corretor"
    : rawType === "imobiliaria" ? "imobiliaria"
    : rawType === "construtora" ? "construtora"
    : rawType === "admin"       ? "admin"
    : "unknown";

  const isBroker   = role === "corretor";
  const isManager  = role === "imobiliaria" || role === "admin";
  const isImobiliaria = role === "imobiliaria";

  const hasPermission = (key: string): boolean => {
    return (user?.permissions ?? []).includes(key);
  };

  return {
    user,
    userId: user?.id ?? null,
    role,
    isBroker,
    isManager,
    isImobiliaria,
    hasPermission,
  };
}
