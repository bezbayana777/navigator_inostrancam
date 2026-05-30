import { YMaps, Map, ObjectManager } from "@pbe/react-yandex-maps";

import styles from "./Styles.module.scss";
import { useBuildings } from "../../../Hooks/useBuildings";
import Loading from "../../../components/Loading/Loading";
import ReturnButton from "../../../components/ReturnButton/ReturnButton";


function PlaneMapPage() {
  const { allBuildings, loading } = useBuildings();

  if (loading) return <Loading />;

  const geoJSON = {
    type: "FeatureCollection",
    features: allBuildings.map((b) => ({
      type: "Feature",
      id: b.id,
      geometry: { type: "Point", coordinates: [b.lon, b.lat] },
      properties: {
        hintContent: b.name,
        balloonContent: `<div style="padding:10px"><strong>${b.name}</strong><br/>${b.address}</div>`
      }
    }))
  };

  return (
    <>
      <YMaps query={{ apikey: import.meta.env.VITE_API_KEY, load: "package.full" }}>
        <Map
          className={styles.map}
          defaultState={{ center: [56.837435, 60.597636], zoom: 4 }}
        >
          <ObjectManager
            features={geoJSON}
            options={{ clusterize: false }}
            objects={{ preset: "islands#blueDotIcon", openBalloonOnClick: true }}
          />
        </Map>
      </YMaps>
    </>
  );
}

export default PlaneMapPage;