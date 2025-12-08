import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { supabase } from "../lib/supabaseClient";

export default function PlanningTest() {
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
    if (event.title === "Disponible") {
      alert(`Créneau cliqué ! ID: ${event.id}\n${event.start.toLocaleString()} - ${event.end.toLocaleString()}`);
    } else {
      alert("Ce créneau n'est pas disponible.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={frLocale}
        timeZone="Europe/Paris"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        events={events}
        eventClick={handleEventClick}
        height="85vh"
      />
    </div>
  );
}
