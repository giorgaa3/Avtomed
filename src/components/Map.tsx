import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  mapboxToken: string;
}

const Map: React.FC<MapProps> = ({ mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [44.7877, 41.7151], // Tbilisi coordinates
      zoom: 12,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add a marker for the business location
    new mapboxgl.Marker({
      color: '#2563eb'
    })
      .setLngLat([44.7877, 41.7151])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold;">AvtoMed</h3>
              <p style="margin: 0; font-size: 14px;">Medical Equipment Supplier</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Tbilisi, Georgia</p>
            </div>
          `)
      )
      .addTo(map.current);

    // Add atmosphere and styling
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
    </div>
  );
};

export default Map;