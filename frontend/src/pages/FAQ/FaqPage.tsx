import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import SuccessPopup from "../../Popups/SuccessPopup/SuccessPopup";
import InfoMap from "../../components/InfoMap/InfoMap";
import PageCard from "../../components/PageCard/PageCard";
import InfoPanel from "../../components/InfoPanel/InfoPanel";
import Checklist from "../../components/Checklist/Checklist";
import faq from "../../assets/faq.svg";
import styles from "./Styles.module.scss";
import { useNavigate } from "react-router";
import ReturnButton from "../../components/ReturnButton/ReturnButton";


const API_URL = import.meta.env.VITE_API_URL

function FaqPage() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [info, setInfo] = useState({ content: "", checklist: [] }) 
  const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      fetch(`${API_URL}/steps/5/articles`)
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

      {isVisible && (
        <SuccessPopup 
          onNext={() => navigate("/check-in")} 
          onClose={() => setIsVisible(prev => !prev)}
        />
      )}

      <ReturnButton />
      <InfoMap zoom={11}>
        <div className={styles.container__info}>
          <PageCard step_id={info.step_id} title={info.title} icon_link={faq} />
          <InfoPanel description={info.content} />
          {info.checklist && info.checklist.length > 0 && (
              <Checklist checklist={info.checklist} setIsVisible={setIsVisible}/>
            )}
        </div>
      </InfoMap>

    </>
  )
}

export default FaqPage