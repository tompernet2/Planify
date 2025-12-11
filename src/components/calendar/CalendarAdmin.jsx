import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";

export default function CalendarAdmin() {
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
                title:
                    c.status === "disponible"
                        ? "Disponible"
                        : c.status === "en_attente"
                            ? "En attente"
                            : "Réservé",
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

    const handleEventClick = (info) => {
        const event = info.event;

        const startHour = event.start.getUTCHours();
        const endHour = event.end.getUTCHours();
        const day = event.start.toLocaleDateString('fr-FR');
        const status = event.extendedProps.status;

        alert(`🔧 ADMIN\nCréneau ID: ${event.id}\nDate: ${day}\nHoraire: ${startHour}h - ${endHour}h\nStatut: ${status}`);
    };

    const renderEventContent = (eventInfo) => {
    const status = eventInfo.event.extendedProps.status;

    const bgColor =
        status === "disponible" ? "bg-green-500" :
            status === "en_attente" ? "bg-yellow-500" :
                "bg-red-500";

    return (
        <div className={`${bgColor} w-full h-full rounded-lg text-white font-medium flex flex-col justify-center items-center`}>
            <div className="text-sm">{eventInfo.event.title}</div>
            <div className="text-xs opacity-80">{eventInfo.timeText}</div>
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