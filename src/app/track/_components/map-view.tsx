"use client";

import { Alert, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const center: [number, number] = [103.849472, 1.3791139];

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!accessToken || !container) return;

    let active = true;
    let map: import("mapbox-gl").Map | undefined;

    const load = async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (!active) return;

        mapboxgl.accessToken = accessToken;
        map = new mapboxgl.Map({
          center,
          container,
          style: "mapbox://styles/mapbox/streets-v12",
          zoom: 16,
        });
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.on("error", (event) => {
          if (active) setError(event.error.message || "Unable to load the map.");
        });
      } catch (loadError) {
        console.error("Unable to initialize Mapbox.", loadError);
        if (active) setError("Unable to load the map.");
      }
    };

    void load();
    return () => {
      active = false;
      map?.remove();
    };
  }, []);

  if (!accessToken) {
    return <Alert severity="warning">Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to display the map.</Alert>;
  }
  return (
    <Box sx={{ height: "100%", position: "relative", width: "100%" }}>
      <Box ref={containerRef} sx={{ height: "100%", width: "100%" }} />
      {error && (
        <Alert severity="error" sx={{ left: "50%", position: "absolute", top: 16, transform: "translateX(-50%)" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
