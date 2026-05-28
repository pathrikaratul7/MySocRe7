import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: ReactNode;
}

type TokenType = {
  exp: number;
};

// Pure function (allowed)
function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenType>(token);

    // Safe because it's NOT inside component render body directly
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  //  Call pure function
  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}