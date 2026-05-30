import styles from "./Styles.module.scss";
import ReviewForm, { type ReviewFormData } from "../../components/ReviewForm/ReviewForm";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

type SuccessPopupProps = {
  onClose: () => void;
  onNext: () => void;
};

function SuccessPopup({ onClose, onNext }: SuccessPopupProps) {
  const [showReview, setShowReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  const { t } = useTranslation();

  const handleReviewSubmit = (data: ReviewFormData) => {
    console.log("Отзыв:", data);
    setShowReview(false);
    setReviewDone(true);
  };

  return (
    <>
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <button className={styles.popupClose} onClick={onClose}>×</button>

          <div className={styles.popupIconWrapper}>
            <div className={styles.popupIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <polyline points="8 12 11 15 16 9" />
              </svg>
            </div>
            <span className={styles.popupSparkle}>✦</span>
          </div>

          <h2 className={styles.popupTitle}>{t('popup.congrats')}</h2>
          <p className={styles.popupSubtitle}>{t('popup.stepDone')}</p>

          <div className={styles.popupBadge}>Шаг завершён ✓</div>

          {/* Кнопка отзыва */}
          {!reviewDone ? (
            <button
              className={styles.popupReviewBtn}
              onClick={() => setShowReview(true)}
            >
              ✏️ {t('popup.leaveReview')}
            </button>
          ) : (
            <p className={styles.popupReviewDone}>Спасибо за отзыв! 🙏</p>
          )}

          {/* Кнопка перехода — заблокирована до отзыва */}
          <button
            className={`${styles.popupCta} ${!reviewDone ? styles.popupCtaDisabled : ""}`}
            onClick={onNext}
            disabled={!reviewDone}
            title={!reviewDone ? "Сначала оставьте отзыв" : ""}
          >
            {t('popup.nextStep')} →
          </button>

          {!reviewDone && (
            <p className={styles.popupHint}>
              Оставьте отзыв, чтобы продолжить
            </p>
          )}
        </div>
      </div>

      {showReview && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onClose={() => setShowReview(false)}
        />
      )}
    </>
  );
}

export default SuccessPopup;
