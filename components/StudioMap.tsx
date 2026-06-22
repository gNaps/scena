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
      html: `<div style="position:relative;width:14px;height:14px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:#C6FF3A;opacity:.25;animation:ping 2.4s cubic-bezier(0,0,.2,1) infinite;"></div>
        <div style="position:absolute;inset:3px;border-radius:50%;background:#C6FF3A;box-shadow:0 0 8px rgba(198,255,58,.7);"></div>
      </div>`,
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
            background:#C6FF3A;
            border-radius:50%;
            border:2px solid rgba(11,11,15,0.25);
            box-shadow:0 0 16px rgba(198,255,58,.5);
            color:#0B0B0F;font-size:13px;font-weight:700;font-family:var(--font-jetbrains),monospace;
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
        ? `<img src="${studio.logoUrl}" alt="${studio.name}" style="width:40px;height:40px;border-radius:2px;object-fit:contain;background:#101015;border:1px solid #1d1d24;padding:4px;flex-shrink:0;" />`
        : `<div style="width:40px;height:40px;border-radius:2px;flex-shrink:0;background:rgba(198,255,58,0.15);border:1px solid #1d1d24;"></div>`;
      const nameHtml = studio.slug
        ? `<a href="/studios/${studio.slug}" style="color:#F4F2EA;font-family:var(--font-bricolage),sans-serif;font-size:16px;font-weight:700;line-height:1.15;text-decoration:none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${studio.name}</a>`
        : `<div style="color:#F4F2EA;font-family:var(--font-bricolage),sans-serif;font-size:16px;font-weight:700;line-height:1.15;">${studio.name}</div>`;
      marker.bindPopup(
        `
        <div style="display:flex;align-items:center;gap:11px;background:#14141A;border:1px solid #2b2b33;border-left:3px solid #C6FF3A;border-radius:2px;padding:12px 14px;min-width:180px;font-family:var(--font-jetbrains),monospace;">
          ${logoHtml}
          <div>
            ${nameHtml}
            <div style="color:#8A8A93;font-size:11px;margin-top:4px;">${studio.location}</div>
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
      style={{ height: "100%", width: "100%", background: "#0B0B0F" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ClusterLayer studios={studios} locale={locale} />
    </MapContainer>
  );
}
