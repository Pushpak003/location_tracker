import { useNavigate } from "react-router-dom";
import{useState} from "react";
function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [expiryHours, setExpiryHours] = useState(1);

  // Start Sharing
  const handleStartSharing =
    async () => {
      try {

        const response =
          await fetch(
            "https://location-tracker-dhe8.onrender.com/api/tracking/create",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },
              body: JSON.stringify({
                expiryHours
              }),
            }
          );

        const data =
          await response.json();

        if (data.success) {

          navigate(
            `/share/${data.session.tracking_id}`
          );

        }

      } catch (error) {

        console.log(error);

      }
  };

  // Logout
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  };

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      "
    >

      <div
        className="
          w-[400px]
          p-8
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
            text-center
          "
        >
          Live Tracker
        </h1>
         <div className="mb-5">

  <label
    className="
      text-zinc-400
      text-sm
      block
      mb-2
    "
  >
    Link Expiry
  </label>

  <select
    value={expiryHours}

    onChange={(e) =>
      setExpiryHours(
        Number(
          e.target.value
        )
      )
    }

    className="
      w-full
      bg-zinc-800
      border
      border-zinc-700
      rounded-xl
      p-3
      text-white
      outline-none
    "
  >

    <option value={1}>
      1 Hour
    </option>

    <option value={8}>
      8 Hours
    </option>

    <option value={24}>
      24 Hours
    </option>

  </select>

</div>
        {/* Start Sharing */}
        <button
          onClick={
            handleStartSharing
          }
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            p-3
            rounded-lg
            mb-6
          "
        >
          Start Sharing
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            w-full
            bg-red-600
            hover:bg-red-700
            p-3
            rounded-lg
          "
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Dashboard;