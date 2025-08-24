import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function App() {
  const [rides, setRides] = useState([]);

  // Načíst všechny jízdy
  const loadData = async () => {
    const querySnapshot = await getDocs(collection(db, "rides"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRides(data);
  };

  // Přidat testovací jízdu
  const addRide = async () => {
    await addDoc(collection(db, "rides"), {
      driver: "Pepa",
      seats: 3,
      from: "Praha",
      to: "Brno"
    });
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1>Test Firebase</h1>
      <button onClick={addRide}>➕ Přidat jízdu</button>
      <button onClick={loadData}>🔄 Načíst jízdy</button>
      <ul>
        {rides.map(r => (
          <li key={r.id}>
            {r.driver}: {r.from} → {r.to} ({r.seats} míst)
          </li>
        ))}
      </ul>
    </div>
  );
}
