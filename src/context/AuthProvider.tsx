import authOptions from "@/lib/auth/config";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath={authOptions.basePath ?? "/api/auth"}>{children}</SessionProvider>;
}
