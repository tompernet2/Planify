import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";
import Button from "../ui/Button";

export default function CalendarAdmin() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
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

    // CRÉATION CRÉNEAU
    const createCreneau = async (date, heureDebut, heureFin) => {
        const start = `${date}T${heureDebut}:00`;
        const end = `${date}T${heureFin}:00`;

        const { error } = await supabase
            .from("creneaux")
            .insert([{ start, end, status: "disponible" }]);

        if (error) {
            console.error("Erreur création créneau :", error);
            return;
        }
        setShowModal(false)
        alert("Créneau créé !");
        setCurrentDate(new Date());
    };

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
            status === "disponible" ? "bg-green text-green-100 hover:bg-green-hover" :
                status === "en_attente" ? "bg-yellow-500" :
                    "bg-red-500";

        return (
            <div className={`${bgColor} w-full h-full p-1.5 rounded-lg flex flex-col cursor-pointer overflow-hidden `}>
                <div className="text-sm">{eventInfo.event.title}</div>
                <div className="text-xs opacity-80">{eventInfo.timeText}</div>
            </div>
        );
    };

    return (
        <div className="relative">
            <div className="fixed bottom-10 right-10 md:absolute md:bottom-5 md:right-5 z-10">
                <Button variant="bulle" onClick={() => setShowModal(true)}>+</Button>
            </div>
            <Calendar
                events={events}
                onEventClick={handleEventClick}
                renderEventContent={renderEventContent}
            />

            {/* POP UP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[300px] space-y-4">

                        <h2 className="text-lg font-semibold">
                            Créer un créneau
                        </h2>

                        <input
                            type="date"
                            id="c-date"
                            className="w-full border rounded px-3 py-2"
                        />

                        <select
                            id="c-start"
                            className="w-full border rounded px-3 py-2"
                            onChange={(e) => {
                                const h = e.target.value;
                                document.getElementById("c-end").value = `${String(Number(h) + 1).padStart(2, "0")}:00`;
                            }}
                        >
                            {Array.from({ length: 11 }).map((_, i) => {
                                const hour = (8 + i).toString().padStart(2, "0");
                                return <option key={hour} value={hour}>{hour}:00</option>;
                            })}
                        </select>


                        <input
                            type="time"
                            id="c-end"
                            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
                            disabled
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-2 bg-gray-200 rounded-lg"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>

                            <button
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={() => {
                                    const d = document.getElementById("c-date").value;
                                    const s = document.getElementById("c-start").value;
                                    const e = document.getElementById("c-end").value;

                                    if (!d || !s || !e) {
                                        alert("Veuillez remplir tous les champs");
                                        return;
                                    }

                                    createCreneau(d, s, e);
                                }}
                            >
                                Créer
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
