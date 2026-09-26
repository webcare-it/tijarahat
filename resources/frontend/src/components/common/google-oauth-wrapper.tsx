import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface Props {
  clientId: string;
  children: React.ReactNode;
}

export const GoogleOAuthWrapper = ({ clientId, children }: Props) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {isReady ? children : <div style={{ minHeight: "40px" }} />}
    </GoogleOAuthProvider>
  );
};
