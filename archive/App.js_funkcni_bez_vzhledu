import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

export default function App() {
  const [role, setRole] = useState(null); // 'driver' nebo 'passenger'
  const [rides, setRides] = useState([]);
  const [newRide, setNewRide] = useState({from:"", to:"", seats:1, price:0, stops:[]});

  // Načtení všech jízd z Firestore
  const loadData = async () => {
    const snapshot = await getDocs(collection(db,"rides"));
    setRides(snapshot.docs.map(d => ({id:d.id, ...d.data()})));
  };

  // Přidání nové jízdy (řidič)
  const addRide = async () => {
    await addDoc(collection(db,"rides"), {
      ...newRide,
      driver: "Kryton",
      passengers: [] // inicializace, aby nikdy nebylo undefined
    });
    loadData();
  };

  // Přidání pasažéra do jízdy
  const joinRide = async (ride) => {
    const rideRef = doc(db,"rides",ride.id);
    const currentPassengers = ride.passengers || [];
    await updateDoc(rideRef, { passengers: [...currentPassengers, "Alice"] });
    loadData();
  };

  useEffect(() => { loadData() }, []);

  // Volba role
  if (!role) return (
    <div>
      <h1>Vyberte roli</h1>
      <button onClick={() => setRole("driver")}>Řidič</button>
      <button onClick={() => setRole("passenger")}>Pasažér</button>
    </div>
  );

  // Zobrazení pro řidiče
  if (role === "driver") return (
    <div>
      <h1>Řidič</h1>
      <input placeholder="Odkud" value={newRide.from} onChange={e=>setNewRide({...newRide, from:e.target.value})}/>
      <input placeholder="Kam" value={newRide.to} onChange={e=>setNewRide({...newRide, to:e.target.value})}/>
      <input type="number" placeholder="Počet míst" value={newRide.seats} onChange={e=>setNewRide({...newRide, seats:Number(e.target.value)})}/>
      <input type="number" placeholder="Cena" value={newRide.price} onChange={e=>setNewRide({...newRide, price:Number(e.target.value)})}/>
      <button onClick={addRide}>Přidat jízdu</button>

      <h2>Seznam jízd</h2>
      <ul>
        {rides.map(r => (
          <li key={r.id}>
            {r.from} → {r.to} ({r.seats - (r.passengers?.length || 0)} volných míst),
            pasažéři: {(r.passengers || []).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );

  // Zobrazení pro pasažéra
  return (
    <div>
      <h1>Pasažér</h1>
      <ul>
        {rides.map(r => (
          <li key={r.id}>
            {r.from} → {r.to} ({r.seats - (r.passengers?.length || 0)} volných míst)
            <button onClick={() => joinRide(r)}>Jedu</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
