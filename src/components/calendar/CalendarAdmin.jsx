import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { supabase } from "../../lib/supabaseClient";
import Button from "../ui/Button";

export default function CalendarAdmin() {
    const [events, setEvents] = useState([]);
    const [calendarApi, setCalendarApi] = useState(null);

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

    return (
        <div className="p-4 bg-white rounded-2xl space-y-4">
            {/* Header personnalisé */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                    {calendarApi?.view.title || "Décembre 2025"}
                </h2>
                
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => calendarApi?.changeView('timeGridWeek')}>
                        Semaine
                    </Button>
                    <Button size="sm" onClick={() => calendarApi?.changeView('timeGridDay')}>
                        Jour
                    </Button>
                    
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    
                    <Button variant="secondary" size="sm" onClick={() => calendarApi?.today()}>
                        Aujourd'hui
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => calendarApi?.prev()}>
                        ←
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => calendarApi?.next()}>
                        →
                    </Button>
                </div>
            </div>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={frLocale}
                timeZone="Europe/Paris"
                
                headerToolbar={false} // Désactive le header par défaut
                
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
                datesSet={(arg) => setCalendarApi(arg.view.calendar)} // Récupère l'API
                
                height="75vh"
                expandRows={true}
                
                allDaySlot={false}
            />
        </div>
    );
}