import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { supabase } from "../../lib/supabaseClient";

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
                backgroundColor:
                    c.status === "disponible"
                        ? "#22c55e"
                        : c.status === "en_attente"
                            ? "#eab308"
                            : "#ef4444",
                borderColor: "transparent",
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
        
        if (event.title === "Disponible") {
            alert(`Créneau cliqué !\nID: ${event.id}\nDate: ${day}\nHoraire: ${startHour}h - ${endHour}h`);
        } else {
            alert("Ce créneau n'est pas disponible.");
        }
    };

    // ✅ Fonction pour styliser après le rendu
    const handleViewDidMount = () => {
        // Stylise tous les boutons
        const buttons = document.querySelectorAll('.fc-button');
        buttons.forEach(btn => {
            btn.classList.add('!bg-blue-600', '!border-blue-600', 'hover:!bg-blue-700', '!rounded-lg', '!px-4', '!py-2', '!text-white', '!font-medium', '!transition-colors');
        });

        // Stylise le titre
        const title = document.querySelector('.fc-toolbar-title');
        if (title) {
            title.classList.add('!text-2xl', '!font-bold', '!text-gray-800');
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={frLocale}
                timeZone="Europe/Paris"
                
                headerToolbar={{
                    left: "title",
                    center: "timeGridWeek,timeGridDay",
                    right: "today prev,next",
                }}
                titleFormat={{
                    year: "numeric",
                    month: "long"
                }}
                dayHeaderFormat={{
                    weekday: "short",
                    day: "numeric"
                }}
                
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                slotDuration="01:00:00"
                slotLabelInterval="01:00:00"
                
                events={events}
                eventClick={handleEventClick}
                viewDidMount={handleViewDidMount} // ✅ Appelé après chaque rendu
                
                height="85vh"
                expandRows={true}
                
                allDaySlot={false}
            />
        </div>
    );
}