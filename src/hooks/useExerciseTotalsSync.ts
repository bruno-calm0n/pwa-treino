import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { loadStoredTotals, persistTotals } from "../storage/exerciseTotals";
import type { ExerciseKey, ExerciseTotals, SyncStatus } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useExerciseTotalsSync = (session: Session | null) => {
  const [totals, setTotals] = useState<ExerciseTotals>(loadStoredTotals);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    persistTotals(totals);
  }, [totals]);

  useEffect(() => {
    const client = supabase;

    if (!client || !session) {
      setRemoteReady(false);
      return;
    }

    let ignore = false;

    const loadRemoteTotals = async () => {
      try {
        setSyncStatus("loading");
        setSyncError("");

        const { data, error } = await client
          .from("exercise_totals")
          .select("flexoes, polichinelos, abdominais")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (ignore) {
          return;
        }

        if (error) {
          throw error;
        }

        if (data) {
          const remoteTotals = {
            flexoes: data.flexoes,
            polichinelos: data.polichinelos,
            abdominais: data.abdominais,
          };

          setTotals(remoteTotals);
          persistTotals(remoteTotals);
        } else {
          const storedTotals = loadStoredTotals();

          const { error: upsertError } = await client
            .from("exercise_totals")
            .upsert({
              user_id: session.user.id,
              ...storedTotals,
              updated_at: new Date().toISOString(),
            });

          if (upsertError) {
            throw upsertError;
          }
        }

        if (!ignore) {
          setRemoteReady(true);
          setSyncStatus("saved");
        }
      } catch (error) {
        if (!ignore) {
          setRemoteReady(false);
          setSyncStatus("error");
          setSyncError(getErrorMessage(error));
        }
      }
    };

    loadRemoteTotals();

    return () => {
      ignore = true;
    };
  }, [session]);

  useEffect(() => {
    const client = supabase;

    if (!client || !session || !remoteReady) {
      return;
    }

    let ignore = false;

    const saveRemoteTotals = async () => {
      try {
        setSyncStatus("saving");
        setSyncError("");

        const { error } = await client.from("exercise_totals").upsert({
          user_id: session.user.id,
          ...totals,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw error;
        }

        if (!ignore) {
          setSyncStatus("saved");
        }
      } catch (error) {
        if (!ignore) {
          setSyncStatus("error");
          setSyncError(getErrorMessage(error));
        }
      }
    };

    saveRemoteTotals();

    return () => {
      ignore = true;
    };
  }, [remoteReady, session, totals]);

  const addExercise = (exercise: ExerciseKey, increment: number) => {
    setTotals((currentTotals) => {
      return {
        ...currentTotals,
        [exercise]: currentTotals[exercise] + increment,
      };
    });
  };

  const removeExercise = (exercise: ExerciseKey, increment: number) => {
    setTotals((currentTotals) => {
      return {
        ...currentTotals,
        [exercise]: Math.max(0, currentTotals[exercise] - increment),
      };
    });
  };

  const isSyncLoading = Boolean(
    session && !remoteReady && syncStatus === "loading",
  );

  const syncLabel =
    syncStatus === "loading"
      ? "Sincronizando..."
      : syncStatus === "saving"
        ? "Salvando..."
        : syncStatus === "saved"
          ? "Sincronizado"
          : syncStatus === "error"
            ? "Erro de sincronização"
            : "Offline local";

  return {
    addExercise,
    isSyncLoading,
    removeExercise,
    syncError,
    syncLabel,
    totals,
  };
};
