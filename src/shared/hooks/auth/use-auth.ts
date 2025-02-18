import { AuthContext } from "@/shared/contexts/auth";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
