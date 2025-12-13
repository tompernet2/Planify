import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function CalendarAdmin() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalOccupe, setShowModalOccupe] = useState(false);
    const [showModalDispo, setShowModalDispo] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedCreneauId, setSelectedCreneauId] = useState(null);



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
                title: c.statut,
                start: c.start,
                end: c.end,
                extendedProps: {
                    statut: c.statut
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
            .insert([{ start, end, statut: "disponible" }]);

        if (error) {
            console.error("Erreur création créneau :", error);
            return;
        }
        setShowModal(false)
        setCurrentDate(new Date());
    };

    // SUPPRIMER CRÉNEAU DISPO
    const deleteCreneau = async () => {

        const { error } = await supabase
            .from("creneaux")
            .delete()
            .eq("id", selectedCreneauId);

        if (error) {
            console.error("Erreur suppression :", error);
            return;
        }
        setShowModalDispo(false);
        setSelectedCreneauId(null);
        setCurrentDate(new Date());
    };


    const handleEventClick = (info) => {
        const event = info.event;
        setSelectedCreneauId(event.id);

        if (event.extendedProps.statut === "occupe") {
            setShowModalOccupe(true)
            // a completer avec les infos de la réservation
        }
        else {
            setShowModalDispo(true)
        }
    };


    const renderEventContent = (eventInfo) => {
        const statut = eventInfo.event.extendedProps.statut;

        const bgColor =
            statut === "disponible" ? "bg-green text-green-100 hover:bg-green-hover" :
                "bg-purple text-purple-100 hover:bg-purple-hover";

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

            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                title="Créer un créneau"
            >
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
                        document.getElementById("c-end").value =
                            `${String(Number(h) + 1).padStart(2, "0")}:00`;
                    }}
                >
                    {Array.from({ length: 11 }).map((_, i) => {
                        const hour = (8 + i).toString().padStart(2, "0");
                        return (
                            <option key={hour} value={hour}>
                                {hour}:00
                            </option>
                        );
                    })}
                </select>

                <input
                    type="time"
                    id="c-end"
                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
                    disabled
                />

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button
                        size="sm"
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
                    </Button>
                </div>
            </Modal>

            <Modal
                open={showModalDispo}
                onClose={() => setShowModalDispo(false)}
                title="Voulez-vous supprimer ce créneau ?"
            >
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModalDispo(false)}
                    >
                        Annuler
                    </Button>
                    <Button size="sm" onClick={deleteCreneau}>
                        Supprimer
                    </Button>
                </div>
            </Modal>

            <Modal
                open={showModalOccupe}
                onClose={() => setShowModalOccupe(false)}
                title="Voici la réservation"
            >
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModalOccupe(false)}
                    >
                        Fermer
                    </Button>
                    <Button size="sm">
                        Supprimer
                    </Button>
                </div>
            </Modal>

        </div>
    );
}
