import InfoMap from "../../components/InfoMap/InfoMap"
import PageCard from "../../components/PageCard/PageCard"
import styles from "./Styles.module.scss"
import InfoPanel from "../../components/InfoPanel/InfoPanel"
import { useEffect, useState } from "react"
import Loading from "../../components/Loading/Loading"
import SuccessPopup from "../../Popups/SuccessPopup/SuccessPopup"
import Checklist from "../../components/Checklist/Checklist"
import motorcycle from "../../assets/motorcycle.svg"
import { Link, useNavigate } from "react-router"
import { useBuildings } from "../../Hooks/useBuildings"
import ReturnButton from "../../components/ReturnButton/ReturnButton"

const API_URL = import.meta.env.VITE_API_URL

function InitialCheckInPage() {

  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [info, setInfo] = useState({ content: "", checklist: [] }) 
  const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      fetch(`${API_URL}/steps/1/articles`)
        .then(response => response.json())
        .then(data => {
          setInfo(data[0])
          setLoading(false)
        })
        .catch(error => {
          console.error("Ошибка:", error)
          setLoading(false)
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

  return (
    <>
       {loading && <Loading/>}

      {isVisible && (
        <SuccessPopup 
          onNext={() => navigate("/dorm")} 
          onClose={() => setIsVisible(prev => !prev)}
        />
      )}

      <ReturnButton />
      <InfoMap features={[getAllBuildingsGeoJSON]} presets={["islands#purpleDotIcon", "islands#greenMoneyIcon"]} zoom={11}>
        <div className={styles.container__info}>

          <Link to="/plane/map" className={styles.mapMobileBtn}>
            🗺️ Открыть карту
          </Link>

          <PageCard step_id={info.step_id} title={info.title} icon_link={motorcycle} />
          <InfoPanel description={info.content} />
          {info.checklist && info.checklist.length > 0 && (
              <Checklist checklist={info.checklist} setIsVisible={setIsVisible}/>
            )}
        </div>
      </InfoMap>
    </>
  )
}

export default InitialCheckInPage