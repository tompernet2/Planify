import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";

export default function CalendarInvite() {
    const [events, setEvents] = useState([]);

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
                title: c.status === "disponible" ? "Disponible" : "Réservé",
                start: c.start,
                end: c.end,
                extendedProps: {
                    status: c.status
                },
            }));

            setEvents(formatted);
        };

        fetchCreneaux();
    }, []);

    const handleEventClick = () => {
        alert("👤 Connectez-vous pour réserver un créneau");
    };

    const renderEventContent = (eventInfo) => {
        const status = eventInfo.event.extendedProps.status;
        
        const bgColor = status === "disponible" ? "bg-green-500" : "bg-red-500";
        
        return (
            <div className={`${bgColor} rounded-lg h-full w-full p-2 text-white font-medium flex flex-col justify-center items-center cursor-pointer hover:opacity-90 transition-opacity`}>
                <div className="text-sm">{eventInfo.event.title}</div>
                <div className="text-xs opacity-80">
                    {eventInfo.timeText}
                </div>
            </div>
        );
    };

    return (
        
        <Calendar 
            events={events}
            onEventClick={handleEventClick}
            renderEventContent={renderEventContent}
        />
    );
}