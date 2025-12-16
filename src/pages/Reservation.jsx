import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabaseClient";
import Button from "../components/ui/Button";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const statutMap = {
    en_attente: { label: "En attente", bg: "bg-purple", text: "text-purple-100" },
    acceptee: { label: "Acceptée", bg: "bg-green", text: "text-green-100" },
    refusee: { label: "Refusée", bg: "bg-red", text: "text-red-100" },
  };

  const handleAccepter = async (reservation) => {
    const { data: existing, error: errExisting } = await supabase
      .from("reservations")
      .select("id")
      .eq("creneau_id", reservation.creneau.id)
      .eq("statut", "acceptee");

    if (errExisting) {
      console.error("Erreur vérification créneau :", errExisting);
      return;
    }

    if (existing.length > 0) {
      alert("Ce créneau est déjà occupé !");
      return;
    }

    console.log("Reservation ID :", reservation.id);

    const { error } = await supabase
      .from("reservations")
      .update({ statut: "acceptee" })
      .eq("id", reservation.id);

    if (error) {
      console.error("Erreur mise à jour réservation :", error);
      return;
    }

    const { error: errorCreneau } = await supabase
      .from("creneaux")
      .update({ statut: "occupe" })
      .eq("id", reservation.creneau.id);

    if (errorCreneau) {
      console.error("Erreur mise à jour créneau :", errorCreneau);
      return;
    }

    setCurrentDate(new Date());
  };

  const handleRefuser = async (reservation) => {
    if (reservation.statut === "en_attente") {
      const { error } = await supabase
        .from("reservations")
        .update({ statut: "refusee" })
        .eq("id", reservation.id);

      if (error) {
        alert("Erreur lors de la mise à jour de la réservation");
        console.error(error);
        return;
      }

    } else if (reservation.statut === "acceptee") {
      const { error: errResa } = await supabase
        .from("reservations")
        .update({ statut: "refusee" })
        .eq("id", reservation.id);

      if (errResa) {
        alert("Erreur lors de la mise à jour de la réservation");
        console.error(errResa);
        return;
      }

      const { error: errCreneau } = await supabase
        .from("creneaux")
        .update({ statut: "disponible" })
        .eq("id", reservation.creneau.id);

      if (errCreneau) {
        alert("Erreur lors de la mise à jour du créneau");
        console.error(errCreneau);
        return;
      }

    }else{
      alert("Réservation déjà refusée.");
    }

    setCurrentDate(new Date());
  };

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reservations")
        .select(`
          id,
          statut,
          client:profiles!client_id(id, nom, prenom),
          creneau:creneaux!creneau_id(id, start, end)
        `);

      if (error) {
        console.error("Erreur fetchReservations:", error);
        setReservations([]);
      } else {
        setReservations(data);
      }

      setLoading(false);
    };

    fetchReservations();
  }, [currentDate]);

  if (loading) return <div>Chargement des réservations...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Réservations</h2>
      <div className="bg-cream-100 p-4 rounded-2xl">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="bg-secondary rounded-xl px-6 py-3 shadow-sm">
              <div className="grid grid-cols-5 gap-4 text-cream tracking-wider">
                <div>Client</div>
                <div>Date</div>
                <div>Horaire</div>
                <div>Statut</div>
                <div>Action</div>
              </div>
            </div>

            <div>
              {reservations.map((res) => {
                const statutInfo = statutMap[res.statut]

                return (
                  <div key={res.id} className="rounded-xl hover:bg-cream transition-all px-6 py-4">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div className="text-sm font-medium text-gray-900">{res.client.nom} {res.client.prenom}</div>
                      <div className="text-sm text-gray-700">
                        {new Date(res.creneau.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-700">
                        de {res.creneau.start.substring(11, 16)} à {res.creneau.end.substring(11, 16)}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium ${statutInfo.bg} ${statutInfo.text}`}>
                          {statutInfo.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Button variant="primary" onClick={() => handleAccepter(res)}>Accepter</Button>
                        <Button variant="primary" onClick={() => handleRefuser(res)}>Refuser</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
