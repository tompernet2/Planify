import React, { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabaseClient";
import { Navigate } from "react-router-dom";

function AdminWrapper({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // 1. Récupère la session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // 2. Récupère le profil
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role") // ou "role" si c’est le nom exact
          .eq("id", session.user.id)
          .single();

        if (error || !profile) {
          setIsAdmin(false);
        } else {
          setIsAdmin(profile.role === "admin"); // ou profile.role === "admin"
        }
      } catch (err) {
        console.error("Erreur AdminWrapper:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <div>Loading ...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}

export default AdminWrapper;
