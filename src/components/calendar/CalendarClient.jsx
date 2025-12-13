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
            const { data, error } = await supabase
                .from("creneaux")
                .select("*")
                .order("start", { ascending: true });

            if (error) {
                console.error("Erreur Supabase :", error);
                return;
            }

            const formatted = data.map((c) => ({
                id: c.id,
                title: c.status,
                start: c.start,
                end: c.end,
                extendedProps: {
                    status: c.status
                },
            }));

            setEvents(formatted);
        };

        fetchCreneaux();
    }, [currentDate]);


    const handleEventClick = (info) => {
        const event = info.event;
        setSelectedCreneauId(event.id);
        console.log("Creneau sélectionné :", event.id);

        if (event.extendedProps.status === "disponible") {
            setShowModal(true)
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
        const status = eventInfo.event.extendedProps.status;

        const bgColor =
            status === "disponible" ? "bg-green text-green-100 hover:bg-green-hover cursor-pointer" :
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
