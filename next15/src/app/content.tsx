"use client";

import "./googlemaps-place-autocomplete.css";

import { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

// #region Constants
// =============================================================================

// Add your Google Maps API key to the .env.local file
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// #region Main Component
// =============================================================================

const Content: React.FC = () => {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [address, setAddress] = useState<string>("");
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setAddress(event.target.value);
  };

  const onPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedCoordinates(place?.geometry?.location?.toJSON() ?? null);
    setAddress(place?.formatted_address ?? "");
  };

  if (!API_KEY) {
    return <div>Google Maps API key is not set</div>;
  }

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <span>{address}</span>
      <Map
        mapId={"bf51a910020fa25a"}
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        className="w-full h-full"
      >
        <AdvancedMarker ref={markerRef} position={null} />
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete
            onPlaceSelect={onPlaceSelect}
            onChange={onChange}
          />
        </div>
      </MapControl>
      <MapHandler selectedCoordinates={selectedCoordinates} marker={marker} />
    </APIProvider>
  );
};

// #region Sub Components
// =============================================================================

interface MapHandlerProps {
  selectedCoordinates: google.maps.LatLngLiteral | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler: React.FC<MapHandlerProps> = ({
  selectedCoordinates,
  marker,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedCoordinates || !marker) return;
    marker.position = selectedCoordinates;
    map.setCenter(selectedCoordinates);
    map.setZoom(15);
  }, [map, selectedCoordinates, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  onPlaceSelect,
  value,
  onChange,
}) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} value={value} onChange={onChange} />
    </div>
  );
};

// #region Exports
// =============================================================================

export default Content;
