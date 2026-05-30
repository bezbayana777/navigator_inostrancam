// utils/geojsonConverter.ts

// Тип для данных с сервера
type ServerBuilding = {
  id: number;
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
}

// Тип для GeoJSON фичи
type GeoJSONFeature = {
  type: "Feature";
  id: number;
  geometry: {
    type: "Point";
    coordinates: [number, number]; 
  };
  properties: {
    name: string;
    address: string;
    hintContent: string;
    balloonContent: string;
  };
}

// Функция для преобразования массива с сервера в GeoJSON
export const convertToGeoJSON = (buildings: ServerBuilding[]) => {
  return {
    type: "FeatureCollection",
    features: buildings.map((building) => ({
      type: "Feature" as const,
      id: building.id,
      geometry: {
        type: "Point" as const,
        // Внимание: в GeoJSON порядок [долгота, широта] = [lon, lat]
        coordinates: [building.lon, building.lat]
      },
      properties: {
        name: building.name,
        address: building.address,
        hintContent: building.name,
        balloonContent: `
          <div style="padding: 10px;">
            <strong>${building.name}</strong><br/>
            ${building.address}<br/>
            <small>${building.description}</small>
          </div>
        `
      }
    }))
  };
};

// Добавляем функции для конкретных типов
export const closeGeoJSON = (buildings: ServerBuilding[]) => {
  return {
    type: "FeatureCollection",
    features: buildings
      .filter(b => b.type === 'close' && b.step_id === 0)
      .map((building) => ({
        type: "Feature" as const,
        id: building.id,
        geometry: {
          type: "Point" as const,
          coordinates: [building.lon, building.lat]
        },
        properties: {
          name: building.name,
          address: building.address,
          hintContent: building.name,
          balloonContent: `
            <div style="padding: 10px;">
              <strong>${building.name}</strong><br/>
              ${building.address}<br/>
              <small>${building.description}</small>
            </div>
          `
        }
      }))
  };
};

export const longGeoJSON = (buildings: ServerBuilding[]) => {
  return {
    type: "FeatureCollection",
    features: buildings
      .filter(b => b.type === 'long' && b.step_id === 0)
      .map((building) => ({
        type: "Feature" as const,
        id: building.id,
        geometry: {
          type: "Point" as const,
          coordinates: [building.lon, building.lat]
        },
        properties: {
          name: building.name,
          address: building.address,
          hintContent: building.name,
          balloonContent: `
            <div style="padding: 10px;">
              <strong>${building.name}</strong><br/>
              ${building.address}<br/>
              <small>${building.description}</small>
            </div>
          `
        }
      }))
  };
};

export const mfcGeoJSON = (buildings: ServerBuilding[]) => {
  return {
    type: "FeatureCollection",
    features: buildings
      .filter(b => b.type === 'mfc')
      .map((building) => ({
        type: "Feature" as const,
        id: building.id,
        geometry: {
          type: "Point" as const,
          coordinates: [building.lon, building.lat]
        },
        properties: {
          name: building.name,
          address: building.address,
          hintContent: building.name,
          balloonContent: `
            <div style="padding: 10px;">
              <strong>${building.name}</strong><br/>
              ${building.address}<br/>
              <small>${building.description}</small>
            </div>
          `
        }
      }))
  };
};

export const bankGeoJSON = (buildings: ServerBuilding[]) => {
  return {
    type: "FeatureCollection",
    features: buildings
      .filter(b => b.type === 'bank')
      .map((building) => ({
        type: "Feature" as const,
        id: building.id,
        geometry: {
          type: "Point" as const,
          coordinates: [building.lon, building.lat]
        },
        properties: {
          name: building.name,
          address: building.address,
          hintContent: building.name,
          balloonContent: `
            <div style="padding: 10px;">
              <strong>${building.name}</strong><br/>
              ${building.address}<br/>
              <small>${building.description}</small>
            </div>
          `
        }
      }))
  };
};