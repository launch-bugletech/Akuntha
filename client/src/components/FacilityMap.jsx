import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { IconArrowRight, IconMapPin } from "./Icons.jsx";

const MAPTILER_KEYS = [
  import.meta.env.VITE_MAPTILER_KEY,
  ...(import.meta.env.VITE_MAPTILER_KEYS || "").split(","),
]
  .map((key) => key?.trim())
  .filter((key, index, keys) => key && keys.indexOf(key) === index);

const PIN_BOUNDARIES_URL = import.meta.env.VITE_PIN_BOUNDARIES_URL;
const INDIA_CENTER = [78.9629, 20.5937];

const ENABLE_MAP_DEV_DETAILS = true;
const SHOW_MAP_DEV_DETAILS =
  import.meta.env.DEV && ENABLE_MAP_DEV_DETAILS;

function coordinatesFromFeature(feature) {
  if (Array.isArray(feature?.center)) return feature.center;

  if (feature?.geometry?.type === "Point") {
    return feature.geometry.coordinates;
  }

  return null;
}

function featureType(feature) {
  return (
    feature?.place_type?.[0] ||
    feature?.type ||
    feature?.id?.split(".")?.[0] ||
    ""
  );
}

function featureText(feature) {
  return feature?.text || feature?.place_name?.split(",")?.[0] || "";
}

function addressFromReverseResult(result) {
  const nodes = (result.features || []).flatMap((feature) => [
    feature,
    ...(feature.context || []),
  ]);

  const findType = (...types) =>
    types
      .map((type) =>
        nodes.find((feature) => featureType(feature) === type),
      )
      .find(Boolean);

  const postalFeature = findType("postal_code", "postcode");

  const landmarkFeature = findType(
    "neighbourhood",
    "locality",
    "place",
    "address",
    "road",
  );

  const cityFeature =
    findType(
      "municipality",
      "municipal_district",
      "subregion",
      "county",
    ) || findType("place");

  const stateFeature = findType("region", "state");

  const postalCandidate =
    postalFeature?.text ||
    postalFeature?.properties?.postcode ||
    nodes.map((feature) => feature.place_name || "").join(" ");

  const pincode = String(
    postalCandidate
      .match(/\b\d{3}[\s-]?\d{3}\b/)?.[0]
      ?.replace(/\D/g, "") || "",
  );

  return {
    ...(pincode ? { pincode } : {}),
    ...(cityFeature ? { city: featureText(cityFeature) } : {}),
    ...(landmarkFeature
      ? { landmark: featureText(landmarkFeature) }
      : {}),
    ...(stateFeature ? { state: featureText(stateFeature) } : {}),
    ...(result.features?.[0]
      ? {
          locationLabel:
            result.features[0].place_name ||
            featureText(result.features[0]),
        }
      : {}),
  };
}

function FacilityMap({
  pincode,
  latitude,
  longitude,
  onLocationChange,
  onManualFallback,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);

  const initialValuesRef = useRef({
    pincode,
    latitude,
    longitude,
  });

  const activeMapTilerKeyIndexRef = useRef(0);

  const [status, setStatus] = useState("");
  const [searching, setSearching] = useState(false);

  onLocationChangeRef.current = onLocationChange;

  /**
   * Runs the same MapTiler request using each configured key.
   *
   * If the active key returns an error or the request fails,
   * it automatically retries using the next key.
   */
  const fetchFromMapTiler = async (createUrl, options) => {
    let lastError;

    for (
      let attempt = 0;
      attempt < MAPTILER_KEYS.length;
      attempt += 1
    ) {
      const keyIndex =
        (activeMapTilerKeyIndexRef.current + attempt) %
        MAPTILER_KEYS.length;

      const key = MAPTILER_KEYS[keyIndex];

      try {
        const response = await fetch(createUrl(key), options);

        if (!response.ok) {
          throw new Error(`MapTiler returned ${response.status}`);
        }

        // Remember the working key for future requests.
        activeMapTilerKeyIndexRef.current = keyIndex;

        return response;
      } catch (error) {
        lastError = error;
      }
    }

    throw (
      lastError ||
      new Error("Every configured MapTiler key failed.")
    );
  };

  const placeMarker = (lng, lat, source = "map") => {
    if (!mapRef.current) return;

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({
        color: "#E97451",
        draggable: true,
      })
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
    if (MAPTILER_KEYS.length === 0) return;

    setStatus("Reading the selected address…");

    try {
      const response = await fetchFromMapTiler((key) => {
        const url = new URL(
          `https://api.maptiler.com/geocoding/${lng},${lat}.json`,
        );

        url.searchParams.set("key", key);

        url.searchParams.set(
          "types",
          "postal_code,address,road,neighbourhood,locality,place,municipality,municipal_district,subregion,county,region",
        );

        url.searchParams.set("limit", "1");
        url.searchParams.set("language", "en");

        return url;
      });

      const result = await response.json();
      const address = addressFromReverseResult(result);

      onLocationChangeRef.current({
        ...address,
        locationSource: source,
      });

      const completed =
        address.pincode && address.city && address.state;

      setStatus(
        completed
          ? "State, city, landmark, and PIN code filled from the selected map point."
          : "Location selected. Please check any address fields that could not be identified.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `${error.message}. The marker is saved; enter the address manually.`
          : "The marker is saved; enter the address manually.",
      );
    }
  };

  useEffect(() => {
    let map;
    let cancelled = false;

    const initializeTimer = window.setTimeout(async () => {
      if (
        !containerRef.current ||
        mapRef.current ||
        MAPTILER_KEYS.length === 0
      ) {
        return;
      }

      try {
        /*
         * Load the map style using the failover function.
         * If key 1 fails, the exact style request is repeated
         * using key 2, key 3, and so on.
         */
        const styleResponse = await fetchFromMapTiler((key) => {
          const url = new URL(
            "https://api.maptiler.com/maps/hybrid-v4/style.json",
          );

          url.searchParams.set("key", key);

          return url;
        });

        const style = await styleResponse.json();

        if (
          cancelled ||
          !containerRef.current ||
          mapRef.current
        ) {
          return;
        }

        map = new maplibregl.Map({
          container: containerRef.current,
          style,
          center:
            initialValuesRef.current.longitude &&
            initialValuesRef.current.latitude
              ? [
                  initialValuesRef.current.longitude,
                  initialValuesRef.current.latitude,
                ]
              : INDIA_CENTER,
          zoom:
            initialValuesRef.current.longitude &&
            initialValuesRef.current.latitude
              ? 15
              : 3.8,
          attributionControl: true,
        });

        mapRef.current = map;

        map.addControl(
          new maplibregl.NavigationControl({
            showCompass: false,
          }),
          "top-right",
        );

        map.on("click", async (event) => {
          placeMarker(
            event.lngLat.lng,
            event.lngLat.lat,
            "map",
          );

          await reverseGeocode(
            event.lngLat.lng,
            event.lngLat.lat,
            "map",
          );
        });

        map.on("load", () => {
          if (!PIN_BOUNDARIES_URL) return;

          map.addSource("india-pin-boundaries", {
            type: "geojson",
            data: PIN_BOUNDARIES_URL,
          });

          const pinValue = [
            "to-string",
            [
              "coalesce",
              ["get", "pincode"],
              ["get", "PINCODE"],
              ["get", "pin_code"],
              ["get", "PIN_CODE"],
              "",
            ],
          ];

          const filter = [
            "==",
            pinValue,
            initialValuesRef.current.pincode || "",
          ];

          map.addLayer({
            id: "india-pin-boundary-fill",
            type: "fill",
            source: "india-pin-boundaries",
            filter,
            paint: {
              "fill-color": "#E97451",
              "fill-opacity": 0.18,
            },
          });

          map.addLayer({
            id: "india-pin-boundary-line",
            type: "line",
            source: "india-pin-boundaries",
            filter,
            paint: {
              "line-color": "#E97451",
              "line-width": 2.5,
            },
          });
        });

        if (
          initialValuesRef.current.longitude &&
          initialValuesRef.current.latitude
        ) {
          placeMarker(
            initialValuesRef.current.longitude,
            initialValuesRef.current.latitude,
            "saved",
          );
        }
      } catch (error) {
        if (!cancelled) {
          setStatus(
            error instanceof Error
              ? `${error.message}. Try again or enter the address manually.`
              : "The map could not be loaded. Enter the address manually.",
          );
        }
      }
    }, 0);

    return () => {
      cancelled = true;

      window.clearTimeout(initializeTimer);

      markerRef.current?.remove();
      markerRef.current = null;

      map?.remove();

      if (mapRef.current === map) {
        mapRef.current = null;
      }
    };

    // Map is intentionally initialized only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map?.getLayer("india-pin-boundary-fill")) {
      return;
    }

    const pinValue = [
      "to-string",
      [
        "coalesce",
        ["get", "pincode"],
        ["get", "PINCODE"],
        ["get", "pin_code"],
        ["get", "PIN_CODE"],
        "",
      ],
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

    if (MAPTILER_KEYS.length === 0) {
      setStatus(
        "MapTiler is not configured. Add VITE_MAPTILER_KEY or VITE_MAPTILER_KEYS to .env.local.",
      );
      return;
    }

    setSearching(true);
    setStatus("Searching PIN code…");

    try {
      const response = await fetchFromMapTiler((key) => {
        const query = encodeURIComponent(`${pincode} India`);

        const url = new URL(
          `https://api.maptiler.com/geocoding/${query}.json`,
        );

        url.searchParams.set("key", key);
        url.searchParams.set("country", "in");
        url.searchParams.set("types", "postal_code");
        url.searchParams.set("limit", "1");
        url.searchParams.set("autocomplete", "false");

        return url;
      });

      const result = await response.json();
      const feature = result.features?.[0];
      const coordinates = coordinatesFromFeature(feature);

      if (!feature || !coordinates) {
        setStatus("No location was found for that PIN code.");
        return;
      }

      const [lng, lat] = coordinates;

      placeMarker(lng, lat, "pincode");

      onLocationChangeRef.current({
        locationLabel:
          feature.place_name ||
          feature.text ||
          pincode,
      });

      if (
        Array.isArray(feature.bbox) &&
        feature.bbox.length === 4
      ) {
        mapRef.current?.fitBounds(
          [
            [feature.bbox[0], feature.bbox[1]],
            [feature.bbox[2], feature.bbox[3]],
          ],
          {
            padding: 36,
            maxZoom: 15,
          },
        );
      } else {
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 15,
        });
      }

      setStatus(
        `PIN ${pincode} located. Click the exact facility or drag the marker.`,
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to search this PIN code.",
      );
    } finally {
      setSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus(
        "Location services are not supported by this browser.",
      );
      return;
    }

    setStatus("Requesting your current location…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          longitude: lng,
          latitude: lat,
        } = position.coords;

        placeMarker(lng, lat, "gps");

        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 16,
        });

        reverseGeocode(lng, lat, "gps");
      },
      (error) => {
        setStatus(
          error.message ||
          "Current location could not be accessed.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  if (MAPTILER_KEYS.length === 0) {
    return (
      <div
        className="map-unavailable"
        role="status"
        aria-label="Map preview unavailable"
      >
        <div className="map-unavailable-content">
          <span
            className="map-unavailable-icon"
            aria-hidden="true"
          >
            <IconMapPin size={34} stroke={1.7} />
          </span>

          <p className="map-unavailable-title">
            Map preview unavailable
          </p>

          <p className="map-unavailable-copy">
            You can still complete the assessment by entering
            the facility address.
          </p>

          <button
            type="button"
            className="map-unavailable-button"
            onClick={onManualFallback}
          >
            Enter address manually
            <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="facility-map-wrap">
      <div className="map-actions">
        <button
          type="button"
          className="map-action"
          onClick={searchPincode}
          disabled={searching}
        >
          {searching ? "Searching…" : "Find PIN on map"}
        </button>

        <button
          type="button"
          className="map-action secondary"
          onClick={useCurrentLocation}
        >
          Use current location
        </button>
      </div>

      <div
        ref={containerRef}
        className="facility-map"
        aria-label="Satellite map for facility location"
      />

      <p className="map-status" aria-live="polite">
        {status ||
          "Search the PIN, use GPS, or click the satellite map to mark the facility."}
      </p>

      {SHOW_MAP_DEV_DETAILS && latitude && longitude && (
        <p className="map-coordinates">
          Selected: {latitude}, {longitude}
        </p>
      )}

      {SHOW_MAP_DEV_DETAILS && !PIN_BOUNDARIES_URL && (
        <p className="map-boundary-note">
          Exact PIN boundary highlighting requires an Indian PIN
          polygon GeoJSON dataset.
        </p>
      )}
    </div>
  );
}

export default FacilityMap;