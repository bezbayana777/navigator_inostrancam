import Checklist from "../../components/Checklist/Checklist";
import InfoMap from "../../components/InfoMap/InfoMap";
import InfoPanel from "../../components/InfoPanel/InfoPanel";
import Loading from "../../components/Loading/Loading";
import PageCard from "../../components/PageCard/PageCard";
import ReviewForm, { type ReviewFormData } from "../../Popups/ReviewPopup/ReviewPopup";
import AllStepsCompletePopup from "../../Popups/AllStepsCompletedPopup/AllStepCompletedPopup";
import styles from "./Styles.module.scss";
import docs from "../../assets/docs.svg";
import { useEffect, useState } from "react";
import ReturnButton from "../../components/ReturnButton/ReturnButton";
import { getUserIdFromToken } from "../../utils/tokenUtils";
import { Link } from "react-router";
import { t } from "i18next";
import {type InfoCard } from "../../types";


const API_URL = import.meta.env.VITE_API_URL

type PopupState = "none" | "review" | "complete";

function VNJPage() {
  const [popupState, setPopupState] = useState<PopupState>("none");
  const [info, setInfo] = useState<InfoCard>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/steps/4/articles`)
      .then(response => response.json())
      .then(data => {
        setInfo(data[0]);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  const handleAllCompleted = () => {
    setPopupState("review");
  };

  const handleReviewSubmit = async (data: ReviewFormData) => {
  const body = {
    stress_level: data.stressLevel,
    waiting_time: {
      noQueue: "Без очереди",
      "15min": "15 мин",
      "30min": "30 мин",
      moreThanHour: "Больше часа",
    }[data.queueTime] ?? data.queueTime,
    hours_match: data.scheduleMatch === "yes",
    correct_hours: data.scheduleMatch === "custom" ? data.scheduleCustom : "",
    documents: data.documents,
    user_id: getUserIdFromToken(),
    building_id: 0,
    step_id: 4,
  };

  try {
    await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Ошибка отправки отзыва:", err);
  }

  setPopupState("complete");
};

  const handleReviewClose = () => {
    setPopupState("complete");
  };

  return (
    <>
      {loading && <Loading />}

      {popupState === "review" && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onClose={handleReviewClose}
        />
      )}

      {popupState === "complete" && (
        <AllStepsCompletePopup
          onClose={() => setPopupState("none")}
        />
      )}

      <ReturnButton />
      <InfoMap zoom={11}>
        <div className={styles.container__info}>

          <Link to="/plane/map" className={styles.mapMobileBtn}>
            🗺️ {t('map')}
          </Link>

          {info && (
            <> 
              <PageCard step_id={info.step_id} title={info.title} icon_link={docs} />
              <InfoPanel description={info.content} />
                {info.checklist && info.checklist.length > 0 && (
                <Checklist checklist={info.checklist} onAllCompleted={handleAllCompleted} />
                )}
            </>)
          }

        </div>
      </InfoMap>
    </>
  );
}

export default VNJPage;
