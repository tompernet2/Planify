import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabaseClient";
import Button from "../components/ui/Button";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const statutMap = {
    en_attente: { label: "En attente", bg: "bg-purple", text: "text-purple-100" },
    acceptee: { label: "Acceptée", bg: "bg-green", text: "text-green-100" },
    refusee: { label: "Refusée", bg: "bg-red", text: "text-red-100" },
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
  }, []);

  if (loading) return <div>Chargement des réservations...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Réservations</h2>
      <div className="bg-cream-100 p-4 rounded-2xl">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="bg-secondary rounded-xl px-6 py-3 shadow-sm">
              <div className="grid grid-cols-6 gap-4 text-cream tracking-wider">
                <div>Client</div>
                <div>Date</div>
                <div>Heure début</div>
                <div>Heure fin</div>
                <div>Statut</div>
                <div className="text-center">Action</div>
              </div>
            </div>

            <div>
              {reservations.map((res) => {
                const statutInfo = statutMap[res.statut] 

                return (
                  <div key={res.id} className="rounded-xl hover:bg-cream transition-all px-6 py-4">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div className="text-sm font-medium text-gray-900">{res.client.nom} {res.client.prenom}</div>
                      <div className="text-sm text-gray-700">
                        {new Date(res.creneau.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-700">
                        {new Date(res.creneau.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} à {new Date(res.creneau.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-sm text-gray-700">
                        {new Date(res.creneau.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium ${statutInfo.bg} ${statutInfo.text}`}>
                          {statutInfo.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Button variant="primary">Modifier</Button>
                        <Button variant="secondary">Supprimer</Button>
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
