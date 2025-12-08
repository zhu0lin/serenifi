import { useState, useEffect, useRef } from "react";

// Assuming LatLngLiteral from other files is defined as:
type LocationState = {
  lat: number;
  lng: number;
} | null;

type PermissionState = "prompt" | "granted" | "denied";

// Set a longer timeout (15 seconds) to prevent 'Timeout expired' error (code: 3)
const LOCATION_TIMEOUT = 15000;

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<LocationState>(null);
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const watchIdRef = useRef<number | null>(null);

  const requestLocation = (timeout: number = LOCATION_TIMEOUT) => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser.");
      return;
    } // Clear any existing watch before starting a new one

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
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
        console.error("Location error:", err); // Set permission to denied if the user blocks access (Code 1)
        if (err.code === 1) {
          setPermission("denied");
        }
        // For timeout (Code 3), we just log and userLocation remains null
      },
      { enableHighAccuracy: true, timeout: timeout, maximumAge: 0 }
    );

    watchIdRef.current = id;
  }; // Check initial permission state

  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((res) => setPermission(res.state as PermissionState));
  }, []); // Start watching location on mount and clean up on unmount

  useEffect(() => {
    requestLocation();

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    userLocation,
    permission,
    requestLocation: () => requestLocation(LOCATION_TIMEOUT),
  };
}
