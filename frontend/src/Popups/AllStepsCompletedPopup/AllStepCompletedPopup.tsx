import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Styles.module.scss";

type AllStepsCompletePopupProps = {
  onClose: () => void;
};

function AllStepsCompletePopup({ onClose }: AllStepsCompletePopupProps) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // небольшая задержка для анимации входа
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  const handleFaq = () => {
    setVisible(false);
    setTimeout(() => navigate("/faq"), 350);
  };

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ""}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`${styles.popup} ${visible ? styles.popupVisible : ""}`}>

        {/* Закрыть */}
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Закрыть">
          ✕
        </button>

        {/* Конфетти-декор */}
        <div className={styles.confetti} aria-hidden>
          {["🎉", "⭐", "✨", "🎊", "💫"].map((e, i) => (
            <span key={i} className={styles.confettiPiece} style={{ "--i": i } as React.CSSProperties}>
              {e}
            </span>
          ))}
        </div>

        {/* Иконка */}
        <div className={styles.iconRing}>
          <div className={styles.iconInner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Текст */}
        <div className={styles.body}>
          <h2 className={styles.title}>Все шаги пройдены!</h2>
          <p className={styles.subtitle}>
            Вы успешно завершили все этапы оформления. Добро пожаловать в студенческую жизнь УрФУ!
          </p>
        </div>

        {/* Разделитель */}
        <div className={styles.divider} />

        {/* FAQ-блок */}
        <div className={styles.faqBlock}>
          <span className={styles.faqIcon}>💬</span>
          <div className={styles.faqText}>
            <p className={styles.faqQuestion}>Остались вопросы?</p>
            <p className={styles.faqSub}>
              Загляните в раздел FAQ — там собраны ответы на самые частые вопросы иностранных студентов.
            </p>
          </div>
        </div>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button className={styles.faqBtn} onClick={handleFaq}>
            Перейти в FAQ →
          </button>
          <button className={styles.closeSecondary} onClick={handleClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllStepsCompletePopup;
