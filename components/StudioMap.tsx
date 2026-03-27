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
  slug?: string;
  coordinates: { lat: number; lng: number };
  logoUrl: string | null;
};

function ClusterLayer({
  studios,
  locale,
}: {
  studios: Studio[];
  locale: string;
}) {
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
      const marker = L.marker(
        [studio.coordinates.lat, studio.coordinates.lng],
        { icon: pinIcon },
      );
      const logoHtml = studio.logoUrl
        ? `<img src="${studio.logoUrl}" alt="${studio.name}" style="width:40px;height:40px;border-radius:8px;object-fit:contain;background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);padding:4px;flex-shrink:0;" />`
        : `<div style="width:40px;height:40px;border-radius:8px;flex-shrink:0;background:linear-gradient(135deg,rgba(139,92,246,0.4),rgba(34,211,238,0.4));border:1px solid rgba(255,255,255,0.1);"></div>`;
      const nameHtml = studio.slug
        ? `<a href="/studios/${studio.slug}" style="color:#ede9fe;font-size:13px;font-weight:600;line-height:1.3;text-decoration:none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${studio.name}</a>`
        : `<div style="color:#ede9fe;font-size:13px;font-weight:600;line-height:1.3;">${studio.name}</div>`;
      marker.bindPopup(
        `
        <div style="display:flex;align-items:center;gap:10px;background:#0d0d1a;border-radius:12px;padding:10px 14px;min-width:170px;border:1px solid rgba(255,255,255,0.08);">
          ${logoHtml}
          <div>
            ${nameHtml}
            <div style="color:#6b7280;font-size:11px;margin-top:3px;">${studio.location}</div>
          </div>
        </div>
      `,
        { className: "studio-popup" },
      );
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    return () => {
      map.removeLayer(cluster);
    };
  }, [map, studios]);

  return null;
}

export default function StudioMap({ locale }: { locale: string }) {
  const studios = useQuery(api.studios.findAllForMap) ?? [];

  return (
    <MapContainer
      center={[42.5, 12.5]}
      zoom={5}
      minZoom={5}
      maxZoom={14}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", background: "#07070f" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ClusterLayer studios={studios} locale={locale} />
    </MapContainer>
  );
}
