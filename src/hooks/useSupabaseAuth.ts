import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useSupabaseAuth = (configError: string) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;

    client.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = client.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setAuthError("");
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const client = supabase;

    if (!client) {
      setAuthError(configError);
      return;
    }

    try {
      setIsSubmittingLogin(true);
      setAuthError("");

      const { error } = await client.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error) {
        throw error;
      }

      setAuthPassword("");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const logout = async () => {
    const client = supabase;

    if (!client) {
      return;
    }

    await client.auth.signOut();
    setSession(null);
  };

  return {
    authEmail,
    authError,
    authLoading,
    authPassword,
    isSubmittingLogin,
    login,
    logout,
    session,
    setAuthEmail,
    setAuthPassword,
  };
};
