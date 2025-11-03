import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  currentUser as selectCurrentUser,
  useCurrentToken as selectCurrentToken,
} from "@/redux/features/auth/authSlice";
import { setUser as setAuthUser } from "@/redux/features/auth/authSlice";
import { readClientTokenCookie } from "@/utils/clientTokenCookie";

type ClientUserPayload = {
  userId?: string;
  _id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type ClientUser = ClientUserPayload | null;

export const useClientUser = () => {
  const storeUser = useAppSelector(selectCurrentUser) as ClientUser;
  const storeToken = useAppSelector(selectCurrentToken);
  const dispatch = useAppDispatch();
  const [user, setClientUser] = useState<ClientUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (storeUser) {
      setClientUser(storeUser);
      setIsLoading(false);
      return;
    }

    const token = storeToken ?? readClientTokenCookie();

    if (!token) {
      setClientUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<ClientUserPayload>(token);
      setClientUser(decoded ?? null);

      if (decoded && (!storeToken || storeToken !== token)) {
        dispatch(setAuthUser({ user: decoded, token }));
      }
    } catch (error) {
      console.error("Failed to decode auth token", error);
      setClientUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, storeUser, storeToken]);

  return { user, isLoading };
};
