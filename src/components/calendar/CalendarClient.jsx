import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Calendar from "./Calendar";
import Button from "../ui/Button"
import Modal from "../ui/Modal";

export default function CalendarClient() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalAccepte, setShowModalAccepte] = useState(false);
    const [selectedCreneauId, setSelectedCreneauId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const statutMap = {
        disponible: { 
            label: "Disponible", 
            bg: "bg-green", 
            text: "text-green-100",
            hover: "hover:bg-green-hover",
            clickable: true
        },
        en_attente: { 
            label: "En attente", 
            bg: "bg-purple", 
            text: "text-purple-100",
            hover: "hover:bg-purple-hover",
            clickable: true 
        },
        acceptee: { 
            label: "Acceptée", 
            bg: "bg-primary", 
            text: "text-primary-100",
            hover: "",
            clickable: true
        },
        refusee: { 
            label: "Refusée", 
            bg: "bg-red", 
            text: "text-red-100",
            hover: "",
            clickable: false
        },
        occupe: { 
            label: "Occupé", 
            bg: "bg-gray-400", 
            text: "text-gray-100",
            hover: "",
            clickable: false 
        }
    };

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
                
                let displayStatut;
                
                if (reservation) {
                    displayStatut = reservation.statut;
                } else {
                    if (c.statut === "disponible") {
                        displayStatut = "disponible"; 
                    } else {
                        displayStatut = "occupe"; 
                    }
                }

                const statutInfo = statutMap[displayStatut] || statutMap.occupe;

                return {
                    id: c.id,
                    title: statutInfo.label,
                    start: c.start,
                    end: c.end,
                    extendedProps: {
                        statut: displayStatut,
                        reservationId: reservation?.id || null,
                        clickable: statutInfo.clickable
                    },
                };
            });

            setEvents(formatted);
        };

        fetchCreneaux();
    }, [currentDate]);

    const handleEventClick = (info) => {
        const event = info.event;
        const statut = event.extendedProps.statut;
        
        if (!event.extendedProps.clickable) {
            return;
        }

        setSelectedCreneauId(event.id);
        console.log("Creneau sélectionné :", event.id);

        if (statut === "disponible") {
            setShowModal(true);
        } else if (statut === "en_attente") {
            setShowModalDelete(true);
        }
        else if (statut === "acceptee") {
            setShowModalAccepte(true);
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
        const statutInfo = statutMap[statut] || statutMap.occupe;

        const cursorClass = statutInfo.clickable ? "cursor-pointer" : "cursor-default";

        return (
            <div className={`${statutInfo.bg} ${statutInfo.text} ${statutInfo.hover} ${cursorClass} w-full h-full p-1.5 rounded-lg flex flex-col overflow-hidden`}>
                <div className="text-sm font-medium">{eventInfo.event.title}</div>
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

            {/* MODAL INSCRIPTION */}
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

            {/* MODAL DÉSINSCRIPTION */}
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
            {/* MODAL ACCEPTÉ */}
            <Modal
                open={showModalAccepte}
                onClose={() => setShowModalAccepte(false)}
                title="Suppression de la réservation"
            >
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowModalAccepte(false)}
                    >
                        Annuler
                    </Button>
                    <Button size="sm" >
                        Se désinscrire
                    </Button>
                </div>
            </Modal>
        </div>
    );
}