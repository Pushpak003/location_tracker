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

import * as turf
from "@turf/turf";

mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN;

function ViewTracking() {

  const { trackingId } =
    useParams();

  const mapRef = useRef(null);

  const mapContainerRef =
    useRef(null);

  const senderMarkerRef =
    useRef(null);

  const viewerMarkerRef =
    useRef(null);

  const socketRef = useRef(null);

  const [distance, setDistance] =
    useState(null);

  useEffect(() => {

    // Map
    mapRef.current =
      new mapboxgl.Map({
        container:
          mapContainerRef.current,

        style:
          "mapbox://styles/mapbox/dark-v11",

        center: [77.4126, 23.2599],

        zoom: 14,
      });

    // Viewer Location
    navigator.geolocation.getCurrentPosition(
      (viewerPosition) => {

        const viewerLat =
          viewerPosition.coords.latitude;

        const viewerLng =
          viewerPosition.coords.longitude;

        // Viewer Marker
        viewerMarkerRef.current =
          new mapboxgl.Marker({
            color: "#22c55e",
          })
            .setLngLat([
              viewerLng,
              viewerLat,
            ])
            .addTo(
              mapRef.current
            );

        // Socket
        socketRef.current = io(
          "http://localhost:5000"
        );

        // Watch Tracking
        socketRef.current.emit(
          "watch-tracking",
          trackingId
        );

        // Receive Sender Location
        socketRef.current.on(
          "receive-location",
          (data) => {

            const {
              latitude,
              longitude,
            } = data;

            // Sender Marker
            if (
              !senderMarkerRef.current
            ) {

              senderMarkerRef.current =
                new mapboxgl.Marker({
                  color: "#ef4444",
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

            // Distance
            const from =
              turf.point([
                viewerLng,
                viewerLat,
              ]);

            const to =
              turf.point([
                longitude,
                latitude,
              ]);

            const options = {
              units: "kilometers",
            };

            const calculatedDistance =
              turf.distance(
                from,
                to,
                options
              );

            setDistance(
              calculatedDistance.toFixed(
                2
              )
            );

            // Camera
            mapRef.current.flyTo({
              center: [
                longitude,
                latitude,
              ],
              speed: 1,
            });

          }
        );

      }
    );

    return () => {

      socketRef.current?.disconnect();

      mapRef.current?.remove();

    };

  }, []);

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
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            mb-3
          "
        >
          Live Tracking
        </h1>

        <div
          className="
            flex
            justify-between
            text-zinc-300
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

      </div>

    </div>
  );
}

export default ViewTracking;