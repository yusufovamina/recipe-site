"use client";

declare global {
  interface Window {
    initMap: () => void;
  }
}


import { useEffect } from "react";

export default function LocationPage() {
  useEffect(() => {
    const initMap = () => {
      // Координаты ресторана (замените на реальные координаты)
      const location = { lat: 37.7749, lng: -122.4194 }; // Пример: Сан-Франциско
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: location,
        zoom: 14,
      });

      new google.maps.Marker({
        position: location,
        map: map,
        title: "Restaurant Location",
      });
    };

    // Загружаем Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);

    // Очищаем скрипт при размонтировании
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Our Location</h1>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400">Address: 123 Taste Street, Food City, FC 12345</p>
          <p className="text-gray-600 dark:text-gray-400">Phone: (555) 123-4567</p>
          <p className="text-gray-600 dark:text-gray-400">Email: info@restaurant.com</p>
        </div>
        <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
          <div id="map" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}