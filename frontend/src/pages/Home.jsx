import { Link } from "react-router-dom";

function Home() {

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
      "
    >

      {/* Navbar */}
      <nav
        className="
          flex
          justify-between
          items-center
          px-8
          py-5
          border-b
          border-zinc-800
        "
      >

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          LiveTrack
        </h1>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="
              px-5
              py-2
              rounded-xl
              bg-zinc-800
              hover:bg-zinc-700
            "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
              px-5
              py-2
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
            "
          >
            Get Started
          </Link>

        </div>

      </nav>

      {/* Hero */}
      <div
        className="
          flex-1
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-5
        "
      >

        <h1
          className="
            text-6xl
            font-extrabold
            mb-6
          "
        >
          Share Your
          Live Location
        </h1>

        <p
          className="
            text-zinc-400
            max-w-2xl
            text-lg
            mb-8
          "
        >
          Realtime live tracking with
          routes, ETA, distance and
          navigation.
        </p>

        <Link
          to="/register"
          className="
            px-8
            py-4
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            text-lg
            font-semibold
          "
        >
          Start Tracking
        </Link>

      </div>

    </div>
  );
}

export default Home;