import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams }
from "react-router-dom";

import mapboxgl
from "mapbox-gl";

import { io }
from "socket.io-client";

mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN;

function ShareTracking() {

  const { trackingId } =
    useParams();

  const mapRef = useRef(null);

  const mapContainerRef =
    useRef(null);

  const socketRef = useRef(null);

  const senderMarkerRef =
    useRef(null);

  const [isCopied, setIsCopied] =
    useState(false);

  const shareLink =
    `${window.location.origin}/view/${trackingId}`;

  useEffect(() => {

    // Map
    mapRef.current =
      new mapboxgl.Map({
        container:
          mapContainerRef.current,

        style:
          "mapbox://styles/mapbox/dark-v11",

        center: [77.4126, 23.2599],

        zoom: 15,
      });

    // Socket
    socketRef.current = io(
      "http://localhost:5000",
      {
        auth: {
          token:
            localStorage.getItem(
              "token"
            ),
        },
      }
    );

    // Live Location
    navigator.geolocation.watchPosition(
      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        // Send Location
        socketRef.current.emit(
          "send-location",
          {
            trackingId,
            latitude,
            longitude,
          }
        );

        // Marker
        if (
          !senderMarkerRef.current
        ) {

          senderMarkerRef.current =
            new mapboxgl.Marker({
              color: "#3b82f6",
            })
              .setLngLat([
                longitude,
                latitude,
              ])
              .addTo(
                mapRef.current
              );

        } else {

          senderMarkerRef.current.setLngLat([
            longitude,
            latitude,
          ]);

        }

        // Camera
        mapRef.current.flyTo({
          center: [
            longitude,
            latitude,
          ],
          speed: 1.2,
        });

      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {

      socketRef.current.disconnect();

      mapRef.current.remove();

    };

  }, []);

  // Copy Link
  const handleCopy = () => {

    navigator.clipboard.writeText(
      shareLink
    );

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="relative h-screen w-full">

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="h-full w-full"
      />

      {/* Bottom Card */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-zinc-900/95
          backdrop-blur-md
          text-white
          rounded-t-3xl
          p-5
          shadow-2xl
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            mb-2
          "
        >
          Live Sharing Active
        </h1>

        <p
          className="
            text-zinc-400
            mb-4
          "
        >
          Anyone with this link
          can track your location.
        </p>

        {/* Link */}
        <div
          className="
            bg-zinc-800
            p-3
            rounded-xl
            text-sm
            break-all
            mb-4
          "
        >
          {shareLink}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            onClick={handleCopy}
            className="
              flex-1
              bg-blue-600
              hover:bg-blue-700
              p-3
              rounded-xl
              font-semibold
            "
          >
            {
              isCopied
                ? "Copied!"
                : "Copy Link"
            }
          </button>

          <button
            onClick={() => {
              navigator.share?.({
                title:
                  "Track My Location",
                url: shareLink,
              });
            }}
            className="
              flex-1
              bg-green-600
              hover:bg-green-700
              p-3
              rounded-xl
              font-semibold
            "
          >
            Share
          </button>

        </div>

      </div>

    </div>
  );
}

export default ShareTracking;