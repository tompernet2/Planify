import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";
import Button from "../ui/Button"
import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";


export default function CalendarInvite() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


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
    }, []);

    const navigateToLogin = () => {
        navigate("/login");
    }

    const handleEventClick = (info) => {
        const event = info.event;
        if (event.extendedProps.statut === "disponible") {
            setShowModal(true)
        }
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

            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                title="Pour vous inscrire veuillez vous connecter"
            >
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModal(false)}
                    >
                        Annuler
                    </Button>
                    <Button size="sm" onClick={navigateToLogin}>
                        Se connecter
                    </Button>
                </div>
            </Modal>

        </div>
    );
}
