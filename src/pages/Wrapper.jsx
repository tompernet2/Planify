import React, { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabaseClient";
import { Navigate } from "react-router-dom";

function Wrapper({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role") 
          .eq("id", session.user.id)
          .single();

        if (error || !profile) {
          setIsAdmin(false);
        } else {
          setIsAdmin(profile.role === "admin");
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

export default Wrapper;
