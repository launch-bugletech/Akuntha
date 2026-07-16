import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const PIN_BOUNDARIES_URL = import.meta.env.VITE_PIN_BOUNDARIES_URL;
const INDIA_CENTER = [78.9629, 20.5937];

function coordinatesFromFeature(feature) {
  if (Array.isArray(feature?.center)) return feature.center;
  if (feature?.geometry?.type === "Point") return feature.geometry.coordinates;
  return null;
}

function featureType(feature) {
  return feature?.place_type?.[0]
    || feature?.type
    || feature?.id?.split(".")?.[0]
    || "";
}

function featureText(feature) {
  return feature?.text || feature?.place_name?.split(",")?.[0] || "";
}

function addressFromReverseResult(result) {
  const nodes = (result.features || []).flatMap((feature) => [feature, ...(feature.context || [])]);
  const findType = (...types) => types
    .map((type) => nodes.find((feature) => featureType(feature) === type))
    .find(Boolean);
  const postalFeature = findType("postal_code", "postcode");
  const landmarkFeature = findType("neighbourhood", "locality", "place", "address", "road");
  const cityFeature = findType("municipality", "municipal_district", "subregion", "county")
    || findType("place");
  const stateFeature = findType("region", "state");
  const postalCandidate = postalFeature?.text
    || postalFeature?.properties?.postcode
    || nodes.map((feature) => feature.place_name || "").join(" ");
  const pincode = String(postalCandidate)
    .match(/\b\d{3}[\s-]?\d{3}\b/)?.[0]
    ?.replace(/\D/g, "") || "";

  return {
    ...(pincode ? { pincode } : {}),
    ...(cityFeature ? { city: featureText(cityFeature) } : {}),
    ...(landmarkFeature ? { landmark: featureText(landmarkFeature) } : {}),
    ...(stateFeature ? { state: featureText(stateFeature) } : {}),
    ...(result.features?.[0]
      ? { locationLabel: result.features[0].place_name || featureText(result.features[0]) }
      : {}),
  };
}

function FacilityMap({ pincode, latitude, longitude, onLocationChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const initialValuesRef = useRef({ pincode, latitude, longitude });
  const [status, setStatus] = useState("");
  const [searching, setSearching] = useState(false);

  onLocationChangeRef.current = onLocationChange;

  const placeMarker = (lng, lat, source = "map") => {
    if (!mapRef.current) return;

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color: "#E97451", draggable: true })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markerRef.current.on("dragend", () => {
        const point = markerRef.current.getLngLat();
        onLocationChangeRef.current({
          latitude: Number(point.lat.toFixed(6)),
          longitude: Number(point.lng.toFixed(6)),
          locationSource: "marker",
        });
        reverseGeocode(point.lng, point.lat, "marker");
      });
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }

    onLocationChangeRef.current({
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      locationSource: source,
    });
  };

  const reverseGeocode = async (lng, lat, source) => {
    if (!MAPTILER_KEY) return;
    setStatus("Reading the selected address…");

    try {
      const url = new URL(`https://api.maptiler.com/geocoding/${lng},${lat}.json`);
      url.searchParams.set("key", MAPTILER_KEY);
      url.searchParams.set(
        "types",
        "postal_code,address,road,neighbourhood,locality,place,municipality,municipal_district,subregion,county,region",
      );
      url.searchParams.set("limit", "1");
      url.searchParams.set("language", "en");

      const response = await fetch(url);
      if (!response.ok) throw new Error(`MapTiler returned ${response.status}`);

      const result = await response.json();
      const address = addressFromReverseResult(result);
      onLocationChangeRef.current({ ...address, locationSource: source });

      const completed = address.pincode && address.city && address.state;
      setStatus(completed
        ? "State, city, landmark, and PIN code filled from the selected map point."
        : "Location selected. Please check any address fields that could not be identified.");
    } catch (error) {
      setStatus(error instanceof Error
        ? `${error.message}. The marker is saved; enter the address manually.`
        : "The marker is saved; enter the address manually.");
    }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/hybrid-v4/style.json?key=${MAPTILER_KEY}`,
      center: initialValuesRef.current.longitude && initialValuesRef.current.latitude
        ? [initialValuesRef.current.longitude, initialValuesRef.current.latitude]
        : INDIA_CENTER,
      zoom: initialValuesRef.current.longitude && initialValuesRef.current.latitude ? 15 : 3.8,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.on("click", async (event) => {
      placeMarker(event.lngLat.lng, event.lngLat.lat, "map");
      await reverseGeocode(event.lngLat.lng, event.lngLat.lat, "map");
    });

    map.on("load", () => {
      if (!PIN_BOUNDARIES_URL) return;

      map.addSource("india-pin-boundaries", {
        type: "geojson",
        data: PIN_BOUNDARIES_URL,
      });
      const pinValue = [
        "to-string",
        ["coalesce", ["get", "pincode"], ["get", "PINCODE"], ["get", "pin_code"], ["get", "PIN_CODE"], ""],
      ];
      const filter = ["==", pinValue, initialValuesRef.current.pincode || ""];

      map.addLayer({
        id: "india-pin-boundary-fill",
        type: "fill",
        source: "india-pin-boundaries",
        filter,
        paint: { "fill-color": "#E97451", "fill-opacity": 0.18 },
      });
      map.addLayer({
        id: "india-pin-boundary-line",
        type: "line",
        source: "india-pin-boundaries",
        filter,
        paint: { "line-color": "#E97451", "line-width": 2.5 },
      });
    });

    mapRef.current = map;

    if (initialValuesRef.current.longitude && initialValuesRef.current.latitude) {
      placeMarker(
        initialValuesRef.current.longitude,
        initialValuesRef.current.latitude,
        "saved",
      );
    }

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // The map is intentionally created once; live form updates flow through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("india-pin-boundary-fill")) return;

    const pinValue = [
      "to-string",
      ["coalesce", ["get", "pincode"], ["get", "PINCODE"], ["get", "pin_code"], ["get", "PIN_CODE"], ""],
    ];
    const filter = ["==", pinValue, pincode || ""];
    map.setFilter("india-pin-boundary-fill", filter);
    map.setFilter("india-pin-boundary-line", filter);
  }, [pincode]);

  const searchPincode = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setStatus("Enter a valid six-digit PIN code first.");
      return;
    }
    if (!MAPTILER_KEY) {
      setStatus("MapTiler is not configured. Add VITE_MAPTILER_KEY to .env.local.");
      return;
    }

    setSearching(true);
    setStatus("Searching PIN code…");

    try {
      const url = new URL(`https://api.maptiler.com/geocoding/${encodeURIComponent(`${pincode} India`)}.json`);
      url.searchParams.set("key", MAPTILER_KEY);
      url.searchParams.set("country", "in");
      url.searchParams.set("types", "postal_code");
      url.searchParams.set("limit", "1");
      url.searchParams.set("autocomplete", "false");

      const response = await fetch(url);
      if (!response.ok) throw new Error(`MapTiler returned ${response.status}`);

      const result = await response.json();
      const feature = result.features?.[0];
      const coordinates = coordinatesFromFeature(feature);
      if (!feature || !coordinates) {
        setStatus("No location was found for that PIN code.");
        return;
      }

      const [lng, lat] = coordinates;
      placeMarker(lng, lat, "pincode");
      onLocationChange({ locationLabel: feature.place_name || feature.text || pincode });

      if (Array.isArray(feature.bbox) && feature.bbox.length === 4) {
        mapRef.current.fitBounds(
          [[feature.bbox[0], feature.bbox[1]], [feature.bbox[2], feature.bbox[3]]],
          { padding: 36, maxZoom: 15 },
        );
      } else {
        mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
      }
      setStatus(`PIN ${pincode} located. Click the exact facility or drag the marker.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to search this PIN code.");
    } finally {
      setSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Location services are not supported by this browser.");
      return;
    }

    setStatus("Requesting your current location…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude: lng, latitude: lat } = position.coords;
        placeMarker(lng, lat, "gps");
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 16 });
        reverseGeocode(lng, lat, "gps");
      },
      (error) => setStatus(error.message || "Current location could not be accessed."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  if (!MAPTILER_KEY) {
    return <p className="map-status map-error">Map unavailable: missing VITE_MAPTILER_KEY.</p>;
  }

  return (
    <div className="facility-map-wrap">
      <div className="map-actions">
        <button type="button" className="map-action" onClick={searchPincode} disabled={searching}>
          {searching ? "Searching…" : "Find PIN on map"}
        </button>
        <button type="button" className="map-action secondary" onClick={useCurrentLocation}>
          Use current location
        </button>
      </div>
      <div ref={containerRef} className="facility-map" aria-label="Satellite map for facility location" />
      <p className="map-status" aria-live="polite">
        {status || "Search the PIN, use GPS, or click the satellite map to mark the facility."}
      </p>
      {latitude && longitude && (
        <p className="map-coordinates">Selected: {latitude}, {longitude}</p>
      )}
      {!PIN_BOUNDARIES_URL && (
        <p className="map-boundary-note">
          Exact PIN boundary highlighting requires an Indian PIN polygon GeoJSON dataset.
        </p>
      )}
    </div>
  );
}

export default FacilityMap;
