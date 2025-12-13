import React, { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabaseClient";
import { Navigate } from "react-router-dom";

function AdminWrapper({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. Récupère la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // 2. Récupère le profil correspondant dans la table profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("statut")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        setIsAdmin(false);
      } else {
        // 3. Vérifie le statut
        setIsAdmin(profile.statut === "admin");
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <div>Loading ...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}

export default AdminWrapper;
