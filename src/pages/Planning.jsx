import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import CalendarAdmin from "../components/calendar/CalendarAdmin";


function Planning() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const run = async () => {
      // Récupère la session actuelle
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        // Récupère le rôle dans la table profiles
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setRole(data.role);
        } else {
          console.error("Erreur lors de la récupération du rôle :", error);
        }
      } else {
        // Pas connecté
        setUser(null);
        setRole("");
      }
    };

    // Lance une première fois
    run();

    // Écoute les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      run();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-4 m-5">
      {!user && <div>Pas connecté</div>}

      {user && role === "admin" && <CalendarAdmin />}
    </div>
  );
}

export default Planning;
