"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

type Studio = {
  _id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
};

function ClusterLayer({ studios }: { studios: Studio[] }) {
  const map = useMap();

  useEffect(() => {
    if (studios.length === 0) return;

    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="
        width:14px;height:14px;
        background:linear-gradient(135deg,#8b5cf6,#22d3ee);
        border-radius:50%;
        border:2px solid rgba(255,255,255,0.3);
        box-shadow:0 0 8px rgba(139,92,246,0.8);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: 40,
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (c: any) => {
        const count = c.getChildCount();
        return L.divIcon({
          className: "",
          html: `<div style="
            display:flex;align-items:center;justify-content:center;
            width:36px;height:36px;
            background:linear-gradient(135deg,#8b5cf6,#22d3ee);
            border-radius:50%;
            border:2px solid rgba(255,255,255,0.25);
            box-shadow:0 0 16px rgba(139,92,246,0.6);
            color:white;font-size:13px;font-weight:700;font-family:sans-serif;
          ">${count}+</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
      },
    });

    studios.forEach((studio) => {
      const marker = L.marker([studio.coordinates.lat, studio.coordinates.lng], { icon: pinIcon });
      marker.bindPopup(`
        <div style="
          color:#ede9fe;background:#0d0d1a;
          padding:6px 10px;border-radius:8px;
          font-size:13px;font-weight:600;min-width:120px;
        ">
          ${studio.name}
          <div style="color:#6b7280;font-weight:400;font-size:11px;margin-top:2px;">${studio.location}</div>
        </div>
      `);
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    return () => { map.removeLayer(cluster); };
  }, [map, studios]);

  return null;
}

export default function StudioMap() {
  const studios = useQuery(api.studios.findAllForMap) ?? [];

  return (
    <MapContainer
      center={[42.5, 12.5]}
      zoom={6}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", background: "#07070f" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ClusterLayer studios={studios} />
    </MapContainer>
  );
}
