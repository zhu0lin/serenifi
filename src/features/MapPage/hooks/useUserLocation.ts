import { useState, useEffect } from "react";

type LocationState = {
  lat: number;
  lng: number;
} | null;

type PermissionState = "prompt" | "granted" | "denied";

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LocationState>(null);
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const [watchId, setWatchId] = useState<number | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser.");
      return;
    }

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setPermission("granted");
      },
      (err) => {
        console.error("Location error:", err);
        if (err.code === 1) {
          setPermission("denied");
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    setWatchId(id);
  };

  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((res) => setPermission(res.state as PermissionState));
  }, []);

  useEffect(() => {
    requestLocation();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { userLocation, permission, requestLocation };
}