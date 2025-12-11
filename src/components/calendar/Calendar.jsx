import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import Button from "../ui/Button";

export default function Calendar({
    events,
    onEventClick,
    renderEventContent
}) {
    const [calendarApi, setCalendarApi] = useState(null);
    const containerRef = useRef(null); // <-- ajout

    // <-- ResizeObserver pour recalcul automatique
    useEffect(() => {
        if (!containerRef.current || !calendarApi) return;

        const observer = new ResizeObserver(() => {
            calendarApi.updateSize();
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [calendarApi]);

    return (
        <div ref={containerRef} className="p-4 bg-white rounded-2xl space-y-4"> {/* <-- ajout ref */}
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

                headerToolbar={false}

                dayHeaderFormat={{
                    weekday: "short",
                    day: "numeric"
                }}

                titleFormat={{
                    year: "numeric",
                    month: "long"
                }}

                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                slotDuration="01:00:00"
                slotLabelInterval="01:00:00"

                events={events}
                eventClick={onEventClick}
                eventContent={renderEventContent}
                datesSet={(arg) => setCalendarApi(arg.view.calendar)}

                height="85vh"
                expandRows={true}

                allDaySlot={false}
                slotEventOverlap={false}

            />
        </div>
    );
}
