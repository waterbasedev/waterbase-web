"use client";

import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapComponent({ latitude, longitude, zoom }) {
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom,
  });

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      <Marker longitude={longitude} latitude={latitude} color="red" />
    </Map>
  );
}
