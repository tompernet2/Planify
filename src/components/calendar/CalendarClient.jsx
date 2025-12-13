import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";
import Button from "../ui/Button"


export default function CalendarClient() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCreneauId, setSelectedCreneauId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());


    useEffect(() => {
        const fetchCreneaux = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const { data: creneaux , error: errorCreneaux } = await supabase
                .from("creneaux")
                .select("*")
                .order("start", { ascending: true });

            if (errorCreneaux) {
                console.error("Erreur Supabase :", errorCreneaux);
                return;
            }
            const { data: reservations, error: resError } = await supabase
            .from("reservations")
            .select("*")
            .eq("client_id", session.user.id);

            if (resError) {
                console.error("Erreur Supabase :", resError);
                return;
            }

            const formatted = creneaux.map((c) => {
                const reservation = reservations.find(r => String(r.creneau_id) === String(c.id));

                return {
                    id: c.id,
                    title: reservation ? "En attente" : c.statut, // si réservation => titre En attente
                    start: c.start,
                    end: c.end,
                    extendedProps: {
                        statut: reservation ? "en_attente" : c.statut, // si réservation => statut en_attente
                        reservationId: reservation?.id || null
                    },
                };
            });

            setEvents(formatted);
        };

        fetchCreneaux();
    }, [currentDate]);


    const handleEventClick = (info) => {
        const event = info.event;
        setSelectedCreneauId(event.id);
        console.log("Creneau sélectionné :", event.id);

        if (event.extendedProps.statut === "disponible") {
            setShowModal(true)
        }
        else if (event.extendedProps.statut === "en_attente") {
            alert("Vous êtes déjà inscrit à ce créneau !");
        }
    };

    const createReservation = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        const { error } = await supabase.from("reservations").insert([
            {
                creneau_id: selectedCreneauId,
                client_id: session.user.id,
                statut: "en_attente",
            },
        ]);

        if (error) {
            console.error("Erreur création demande :", error);
            return;
        }

        alert("Votre demande a été envoyée !");
        setShowModal(false);
        setCurrentDate(new Date()); 
    };


    const renderEventContent = (eventInfo) => {
        const statut = eventInfo.event.extendedProps.statut;

        const bgColor =
            statut === "disponible" ? "bg-green text-green-100 hover:bg-green-hover cursor-pointer" :
                "bg-purple text-purple-100";

        return (
            <div className={`${bgColor} w-full h-full p-1.5 rounded-lg flex flex-col  overflow-hidden `}>
                <div className="text-sm">{eventInfo.event.title}</div>
                <div className="text-xs opacity-80">{eventInfo.timeText}</div>
            </div>
        );
    };

    return (
        <div className="relative">
            <Calendar
                events={events}
                onEventClick={handleEventClick}
                renderEventContent={renderEventContent}
            />

            {/* POP UP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-[300px] space-y-4 z-60 " onClick={(e) => e.stopPropagation()}>

                        <h2 className="text-lg font-semibold">
                            Voulez vous vous inscrire a ce créneau ?
                        </h2>

                        <div className="flex justify-end gap-2">

                            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Annuler</Button>
                            <Button size="sm" onClick={createReservation} >S'inscrire</Button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
