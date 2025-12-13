import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";
import Button from "../ui/Button"
import Modal from "../ui/Modal";



export default function CalendarClient() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectedCreneauId, setSelectedCreneauId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());


    useEffect(() => {
        const fetchCreneaux = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const { data: creneaux, error: errorCreneaux } = await supabase
                .from("creneaux")
                .select("*")
                .order("start", { ascending: true });

            if (errorCreneaux) {
                console.error("Erreur Supabase :", errorCreneaux);
                return;
            }
            const { data: reservations, error: resError } = await supabase
                .from("reservations")
                .select("*")
                .eq("client_id", session.user.id);

            if (resError) {
                console.error("Erreur Supabase :", resError);
                return;
            }

            const formatted = creneaux.map((c) => {
                const reservation = reservations.find(r => String(r.creneau_id) === String(c.id));

                return {
                    id: c.id,
                    title: reservation ? "En attente" : c.statut, // si réservation => titre En attente
                    start: c.start,
                    end: c.end,
                    extendedProps: {
                        statut: reservation ? "en_attente" : c.statut, // si réservation => statut en_attente
                        reservationId: reservation?.id || null
                    },
                };
            });

            setEvents(formatted);
        };

        fetchCreneaux();
    }, [currentDate]);


    const handleEventClick = (info) => {
        const event = info.event;
        setSelectedCreneauId(event.id);
        console.log("Creneau sélectionné :", event.id);

        if (event.extendedProps.statut === "disponible") {
            setShowModal(true)
        }
        else if (event.extendedProps.statut === "en_attente") {
            setShowModalDelete(true);
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


    const deleteReservation = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        const { error } = await supabase
            .from("reservations")
            .delete()
            .eq("client_id", session.user.id)
            .eq("creneau_id", selectedCreneauId);

        if (error) {
            console.error("Erreur désinscription :", error);
            return;
        }
        alert("Vous êtes désinscrit !");
        setShowModalDelete(false);
        setCurrentDate(new Date());
    };





    const renderEventContent = (eventInfo) => {
        const statut = eventInfo.event.extendedProps.statut;

        const bgColor =
            statut === "disponible" ? "bg-green text-green-100 hover:bg-green-hover cursor-pointer" :
                "bg-purple text-purple-100 ";

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
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                title="Voulez-vous vous inscrire à ce créneau ?"
            >
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModal(false)}
                    >
                        Annuler
                    </Button>
                    <Button size="sm" onClick={createReservation}>
                        S'inscrire
                    </Button>
                </div>
            </Modal>

            <Modal
                open={showModalDelete}
                onClose={() => setShowModalDelete(false)}
                title="Voulez-vous vous désinscrire ?"
            >
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModalDelete(false)}
                    >
                        Annuler
                    </Button>
                    <Button size="sm" onClick={deleteReservation}>
                        Se désinscrire
                    </Button>
                </div>
            </Modal>

        </div>
    );
}
