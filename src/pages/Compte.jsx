import React, { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function Compte() {
    const [user, setUser] = useState(null);
    const [profiles, setProfiles] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session || !session.user) {
                navigate("/login");
            } else {
                setUser(session.user);

                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (error) {
                    console.error("Erreur récupération profil :", error);
                } else {
                    setProfiles(data);
                }
            }
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            checkUser();
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (!user || !profiles) return null;

    return (
        <div className="rounded-2xl">
            <h1 className="text-2xl font-bold mb-4">Bonjour, {profiles.prenom}</h1>

            <div className="bg-cream-100 text-secondary p-4 rounded-2xl inline-block max-w-full break-words">
                <div className="mb-2">
                    <strong>Prénom :</strong> {profiles.prenom}
                </div>

                <div className="mb-2">
                    <strong>Nom :</strong> {profiles.nom}
                </div>

                <div className="mb-2">
                    <strong>Email :</strong> {user.email}
                </div>

                <div>
                    <strong>Rôle :</strong> {profiles.role}
                </div>                
            </div>
        </div>
    );
}

export default Compte;