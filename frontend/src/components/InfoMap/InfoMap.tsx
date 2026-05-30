import { YMaps, Map, ObjectManager } from "@pbe/react-yandex-maps";
import styles from "./Styles.module.scss"
import { type ReactNode } from "react";
import { Link } from "react-router";


type InfoMapProps = {
  features?: any, 
  presets?: string[],
  zoom: number,
  children: ReactNode,
  mapRoute?: string;
}

function InfoMap({ features, presets, zoom, children, mapRoute }: InfoMapProps) {

  const renderPlacemarks = () => {
    return features.map((feature, index) => {return (
      <ObjectManager 
        key={index}
        features={feature()}
        options={{
          clusterize: false
        }}
        objects={{
          preset: presets[index],
          openBalloonOnClick: true
        }}
      />
    )}
  )
}

  return (
    <div className={styles.container}>
      {children}

      {/* Кнопка только на мобильном */}
      {mapRoute && (
        <Link to={mapRoute} className={styles.mapMobileBtn}>
          🗺️ Открыть карту
        </Link>
      )}
    
      <div className={styles.container__map}>
        <YMaps query={{apikey: import.meta.env.VITE_API_KEY, load: 'package.full'}}>
          <Map 
            className={styles.map} 
            defaultState={{center: [56.837435, 60.597636], zoom: zoom}}
          >
            {features && renderPlacemarks()}
          </Map>
        </YMaps>
      </div>
    </div>
  )
}

export default InfoMap;