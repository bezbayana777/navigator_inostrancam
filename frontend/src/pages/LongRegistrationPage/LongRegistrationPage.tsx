
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
import { useNavigate } from "react-router"

const API_URL = import.meta.env.VITE_API_URL

function InitialRegistrationPage(){

const [isVisible, setIsVisible] = useState(false)
  const [info, setInfo] = useState({ content: "", checklist: [] }) 
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
    useEffect(() => {
      fetch(`${API_URL}/steps/3/articles`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setInfo(data[0])
          setLoading(false)
        })
        .catch(error => {
          console.error("Ошибка:", error)
          setLoading(false)
        })
    }, [])

  return (
    <>
       {loading && <Loading/>}

      {isVisible && <SuccessPopup onNext={() => navigate("/vnj")} onClose={() => setIsVisible(prev => !prev)}/>}

      <ReturnButton />
      <InfoMap zoom={11}>
        <div className={styles.container__info}>
          <PageCard step_id={info.step_id} title={info.title} icon_link={docs} />
          <InfoPanel description={info.content} />
          {info.checklist && info.checklist.length > 0 && (
              <Checklist checklist={info.checklist} setIsVisible={setIsVisible}/>
            )}
        </div>
      </InfoMap>

    </>
  )
}


export default InitialRegistrationPage