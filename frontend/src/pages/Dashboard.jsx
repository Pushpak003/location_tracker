import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  // Start Sharing
  const handleStartSharing =
    async () => {

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/tracking/create",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },
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