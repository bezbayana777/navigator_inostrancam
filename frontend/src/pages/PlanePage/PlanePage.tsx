import InfoMap from "../../components/InfoMap/InfoMap"
import PageCard from "../../components/PageCard/PageCard"
import styles from "./Styles.module.scss"

import BasePage from "../BasePage/BasePage"
import Button from "../../components/UI/Button/Button"
import { useEffect, useState } from "react"
import { steps } from "../../DB/points"
import InfoPanel from "../../components/InfoPanel/InfoPanel"

import Checklist from "../../components/Checklist/Checklist"

import SuccessPopup from "../../Popups/SuccessPopup/SuccessPopup"
import Loading from "../../components/Loading/Loading"

import plane from "../../assets/plane.svg"
import { useNavigate } from "react-router"
import { useBuildings } from "../../Hooks/useBuildings"

const API_URL = import.meta.env.VITE_API_URL

function PlanePage() {
  const [location, setLocation] = useState<'close'|'far'|null>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  const [info, setInfo] = useState({ content: "", checklist: [] }) 
  const [loadingArticles, setLoadingArticles] = useState(true)

  const navigate = useNavigate()

  // Загрузка статей
  useEffect(() => {
    fetch(`${API_URL}/steps/0/articles`)
      .then(response => response.json())
      .then(data => {
        setInfo(data[0])
        setLoadingArticles(false)
      })
      .catch(error => {
        console.error("Ошибка:", error)
        setLoadingArticles(false)
      })
  }, [])

  
  const { allBuildings, loading: loadingBuildings } = useBuildings()
  // Функция, которая просто возвращает все здания (для InfoMap)
  const getAllBuildingsGeoJSON = () => {
    return {
      type: "FeatureCollection",
      features: allBuildings.map((building) => ({
        type: "Feature",
        id: building.id,
        geometry: {
          type: "Point",
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

  if (loadingArticles || loadingBuildings) {
    return <Loading />
  }

  return (
    <>
      {isVisible && (
        <SuccessPopup 
          onNext={() => navigate("/check-in")} 
          onClose={() => setIsVisible(prev => !prev)}
        />
      )}

      <BasePage/>
      
      <InfoMap 
        features={[getAllBuildingsGeoJSON]} 
        presets={["islands#blueDotIcon"]} 
        zoom={4}
      >
        <div className={styles.container__info}>
          <PageCard step_id={info.step_id} title={info.title} icon_link={plane} />

          <h3 className={styles.container__subtitle}>Выбери, откуда ты</h3>
          <div className={styles.container__buttons}>
            <Button content="Ближнее зарубежье" onClick={() => setLocation("close")}/>
            <Button content="Дальнее зарубежье" onClick={() => setLocation("far")}/>
          </div>

          {location === "close" && <InfoPanel description={steps[0].description_for_near_abroad}/>}
          {location === "far" && <InfoPanel description={steps[0].description_for_far_abroad}/>}

          <InfoPanel description={info.content} />
          
          <h3 className={styles.container__subtitle}>Чеклист</h3>
          <ul className={styles.container__checklist}>     
            {info.checklist && info.checklist.length > 0 && (
              <Checklist checklist={info.checklist} setIsVisible={setIsVisible}/>
            )}
          </ul>
        </div>
      </InfoMap>
    </>
  )
}

export default PlanePage