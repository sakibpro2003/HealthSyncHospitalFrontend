import { useEffect, useState } from "react";

type ClientUser = {
  userId?: string;
  _id?: string;
  email?: string;
  name?: string;
  role?: string;
} | null;

export const useClientUser = () => {
  const [user, setUser] = useState<ClientUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) {
          throw new Error("Unauthenticated");
        }
        const payload = await response.json();
        if (isMounted) {
          setUser(payload?.user ?? null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, isLoading };
};

