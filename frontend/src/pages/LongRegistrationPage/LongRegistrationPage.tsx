import Checklist from "../../components/Checklist/Checklist"
import InfoMap from "../../components/InfoMap/InfoMap"
import InfoPanel from "../../components/InfoPanel/InfoPanel"
import Loading from "../../components/Loading/Loading"
import PageCard from "../../components/PageCard/PageCard"
import SuccessPopup from "../../Popups/SuccessPopup/SuccessPopup"
import docs from "../../assets/docs.svg"
import { useEffect, useState } from "react"
import styles from "./Styles.module.scss"
import ReturnButton from "../../components/ReturnButton/ReturnButton"
import { Link, useNavigate } from "react-router"
import { t } from "i18next"
import { type InfoCard } from "../../types"

const API_URL = import.meta.env.VITE_API_URL

function InitialRegistrationPage(){
  const [isVisible, setIsVisible] = useState(false)
  const [info, setInfo] = useState<InfoCard | null>(null) 
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch(`${API_URL}/steps/3/articles`)
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

  // ✅ Показываем загрузку, пока нет данных
  if (loading || !info) {
    return <Loading />
  }

  return (
    <>
      {isVisible && (
        <SuccessPopup 
          onNext={() => navigate("/vnj")} 
          onClose={() => setIsVisible(prev => !prev)}
        />
      )}

      <ReturnButton />
      <InfoMap zoom={11}>
        <div className={styles.container__info}>
          <Link to="/plane/map" className={styles.mapMobileBtn}>
            🗺️ {t('map')}
          </Link>

          <PageCard step_id={info.step_id} title={info.title} icon_link={docs} />
          <InfoPanel description={info.content} />
          {info.checklist && info.checklist.length > 0 && (
            <Checklist checklist={info.checklist} setIsVisible={setIsVisible} />
          )}
        </div>
      </InfoMap>
    </>
  )
}

export default InitialRegistrationPage