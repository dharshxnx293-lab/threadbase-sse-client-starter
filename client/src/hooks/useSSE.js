// hooks/useSSE.js
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not open a protected stream while logged out.
    if (!user) return;

    const source = new EventSource(url, { withCredentials: true });

    source.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (error) {
        console.error("[useSSE] Failed to parse event data:", event.data, error);
      }
    };

    source.onerror = (error) => {
      console.error("[useSSE] EventSource error:", error);
    };

    // Close the old connection on unmount or before reconnecting the effect.
    return () => source.close();
  }, [url, user, onMessage]);
}
