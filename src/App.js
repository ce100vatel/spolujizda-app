import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

function App() {
  const [rides, setRides] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [seats, setSeats] = useState(1);
  const [mode, setMode] = useState("passenger"); // passenger | driver
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      const querySnapshot = await getDocs(collection(db, "rides"));
      setRides(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchRides();
  }, []);

  const addRide = async () => {
    if (!from || !to || seats < 1) return;
    const newRide = { from, to, seats: parseInt(seats) };
    await addDoc(collection(db, "rides"), newRide);
    setFrom("");
    setTo("");
    setSeats(1);
    const querySnapshot = await getDocs(collection(db, "rides"));
    setRides(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const joinRide = async (rideId, seatsAvailable) => {
    if (seatsAvailable <= 0) return;
    const rideRef = doc(db, "rides", rideId);
    await updateDoc(rideRef, { seats: seatsAvailable - 1 });
    const querySnapshot = await getDocs(collection(db, "rides"));
    setRides(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
     <div className={`app ${darkMode ? "dark" : "light"}`}>

        {/* Horní lišta */}

          <h1 className="text-xl font-bold">🚗 Spolujízda</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "🌞 Světlý" : "🌙 Tmavý"}
            </button>
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={() =>
                setMode(mode === "passenger" ? "driver" : "passenger")
              }
            >
              Přepnout na {mode === "passenger" ? "Řidič" : "Pasažér"}
            </button>
          </div>


        {/* Režim řidiče */}
        {mode === "driver" && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">➕ Přidat jízdu</h2>
            <input
              className="border p-2 mr-2 rounded text-black"
              placeholder="Odkud"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              className="border p-2 mr-2 rounded text-black"
              placeholder="Kam"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <input
              type="number"
              className="border p-2 mr-2 rounded text-black w-20"
              placeholder="Místa"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
            <button
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={addRide}
            >
              Přidat
            </button>
          </div>
        )}

        {/* Režim pasažéra */}
        {mode === "passenger" && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">📋 Dostupné jízdy</h2>
            {rides.length === 0 ? (
              <p>Žádné jízdy nejsou k dispozici.</p>
            ) : (
              <ul className="space-y-2">
                {rides.map((ride) => (
                  <li
                    key={ride.id}
                    className="border p-3 rounded flex justify-between items-center dark:border-gray-700"
                  >
                    <span>
                      {ride.from} → {ride.to} ({ride.seats} míst)
                    </span>
                    <button
                      disabled={ride.seats <= 0}
                      className={`px-3 py-1 rounded ${
                        ride.seats > 0
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-400 text-gray-700 cursor-not-allowed"
                      }`}
                      onClick={() => joinRide(ride.id, ride.seats)}
                    >
                      Přidat se
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

    </div>
  );
}

export default App;
