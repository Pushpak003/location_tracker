import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import * as turf from "@turf/turf";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function ViewTracking() {
  const [expired, setExpired] = useState(false);
  const { trackingId } = useParams();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const senderMarkerRef = useRef(null);
  const viewerMarkerRef = useRef(null);
  const socketRef = useRef(null);
  const viewerCoordsRef = useRef(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("Waiting...");
  const [followMode, setFollowMode] = useState(true);
  const [mapStyle, setMapStyle] =useState(  "mapbox://styles/mapbox/dark-v11");

  // Route Function
  const getRoute = async (viewerLng, viewerLat, senderLng, senderLat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${viewerLng},${viewerLat};${senderLng},${senderLat}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
      );

      const data = await response.json();
      console.log(data);
      if (!data.routes || !data.routes.length) return;

      const route = data.routes[0];
      // ETA
      const durationMinutes = Math.floor(route.duration / 60);

      setEta(`${durationMinutes} mins`);

      const coordinates = route.geometry.coordinates;

      // Remove old route
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route");

        mapRef.current.removeSource("route");
      }

      // Add Route
      mapRef.current.addSource("route", {
        type: "geojson",

        data: {
          type: "Feature",

          geometry: {
            type: "LineString",

            coordinates,
          },
        },
      });

      mapRef.current.addLayer({
        id: "route",

        type: "line",

        source: "route",

        layout: {
          "line-join": "round",
          "line-cap": "round",
        },

        paint: {
          "line-color": "#3b82f6",

          "line-width": 5,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Create Map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,

      style: mapStyle,

      center: [77.4126, 23.2599],

      zoom: 14,
    });
    const verifyTracking =
  async () => {

    try {

      const response =
        await fetch(
          `https://location-tracker-dhe8.onrender.com/api/tracking/${trackingId}`
        );

      const data =
        await response.json();

      if (!data.success) {

        setExpired(true);

      }

    } catch (error) {

      setExpired(true);

    }

};

verifyTracking();

    // Viewer Location
    navigator.geolocation.getCurrentPosition((viewerPosition) => {
      const viewerLat = viewerPosition.coords.latitude;
      const viewerLng = viewerPosition.coords.longitude;

      viewerCoordsRef.current = {
        viewerLat,
        viewerLng,
      };

      // Viewer Marker
      viewerMarkerRef.current = new mapboxgl.Marker({
        color: "#22c55e",
      })
        .setLngLat([viewerLng, viewerLat])
        .addTo(mapRef.current);

      // Socket
      socketRef.current = io("https://location-tracker-dhe8.onrender.com");

      // Watch Tracking
      socketRef.current.emit("watch-tracking", trackingId);

      // Receive Sender Location
      socketRef.current.on("receive-location", (data) => {
        const { latitude, longitude } = data;

        // Last Updated
        setLastUpdated(
  new Date().toLocaleTimeString()
);

        // Sender Marker
        if (!senderMarkerRef.current) {
          senderMarkerRef.current = new mapboxgl.Marker({
            color: "#ef4444",
          })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        } else {
          // Smooth Movement
          senderMarkerRef.current.setLngLat([longitude, latitude]);
        }

        // Distance
        // Distance
        const currentViewerCoords =
  viewerCoordsRef.current;

if (!currentViewerCoords)
  return;

const {
  viewerLat,
  viewerLng,
} = currentViewerCoords;

// Distance
const from = turf.point([
  viewerLng,
  viewerLat,
]);

const to = turf.point([
  longitude,
  latitude,
]);

const calculatedDistance =
  turf.distance(
    from,
    to,
    {
      units:
        "kilometers",
    }
  );

setDistance(
  calculatedDistance.toFixed(2)
);

// Route + ETA
getRoute(
  viewerLng,
  viewerLat,
  longitude,
  latitude
);
        // Follow Mode
        if (followMode) {
          mapRef.current.flyTo({
            center: [longitude, latitude],

            speed: 1,
          });
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();

      mapRef.current?.remove();
    };
  }, []);

  // Recenter
  const handleRecenter = () => {
    if (senderMarkerRef.current) {
      const lngLat = senderMarkerRef.current.getLngLat();

      mapRef.current.flyTo({
        center: [lngLat.lng, lngLat.lat],

        zoom: 15,

        speed: 1,
      });
    }
  };
  if (expired) {

  return (

    <div
      className="
        h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
      "
    >

      <div
        className="
          text-center
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            mb-3
          "
        >
          Tracking Expired
        </h1>

        <p
          className="
            text-zinc-400
          "
        >
          This live tracking link
          is no longer active.
        </p>

      </div>

    </div>

  );

}
  
  return (
  <div
    className="
      relative
      h-screen
      w-full
      overflow-hidden
      bg-black
    "
  >

    {/* Map */}
    <div
      ref={mapContainerRef}
      className="
        absolute
        inset-0
      "
    />

    {/* Overlay */}
    <div
      className="
        absolute
        inset-0
        z-10
        pointer-events-none
      "
    >

      {/* Recenter */}
      <button
        onClick={handleRecenter}
        className="
          absolute
          top-5
          right-5
          pointer-events-auto
          bg-zinc-900
          text-white
          p-4
          rounded-full
          shadow-xl
        "
      >
        📍
      </button>

      {/* Map Style */}
      <select
        value={mapStyle}
        onChange={(e) => {

          const style =
            e.target.value;

          setMapStyle(style);

          if (mapRef.current) {

            mapRef.current.setStyle(
              style
            );

          }

        }}
        className="
          absolute
          top-5
          left-5
          pointer-events-auto
          bg-zinc-900
          text-white
          px-4
          py-3
          rounded-xl
          outline-none
        "
      >

        <option value="mapbox://styles/mapbox/dark-v11">
          Dark
        </option>

        <option value="mapbox://styles/mapbox/streets-v12">
          Light
        </option>

        <option value="mapbox://styles/mapbox/satellite-streets-v12">
          Satellite
        </option>

      </select>

      {/* Bottom Card */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          pointer-events-auto
          bg-zinc-900/95
          backdrop-blur-md
          text-white
          rounded-t-3xl
          p-5
        "
      >

        <div className="flex items-center justify-between mb-3">

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Live Tracking
          </h1>

          <div
            className="
              flex
              items-center
              gap-2
              text-green-400
              text-sm
            "
          >

            <div
              className="
                w-2
                h-2
                rounded-full
                bg-green-400
                animate-pulse
              "
            />

            Live

          </div>

        </div>

        {/* Distance */}
        <div
          className="
            flex
            justify-between
            text-zinc-300
            mb-2
          "
        >

          <span>
            Distance
          </span>

          <span>
            {
              distance
                ? `${distance} km`
                : "Calculating..."
            }
          </span>

        </div>

        {/* ETA */}
        <div
          className="
            flex
            justify-between
            text-zinc-300
            mb-2
          "
        >

          <span>
            ETA
          </span>

          <span>
            {
              eta
                ? eta
                : "Calculating..."
            }
          </span>

        </div>

        {/* Last Updated */}
        <div
          className="
            flex
            justify-between
            text-zinc-300
          "
        >

          <span>
            Last Updated
          </span>

          <span>
            {lastUpdated}
          </span>

        </div>

      </div>

    </div>

  </div>
);
}

export default ViewTracking;
