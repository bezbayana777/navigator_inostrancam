import { Link } from "react-router";
import styles from "./Styles.module.scss";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "deportation_start_date";
const STORAGE_DONE_KEY = "deportation_done";
const TOTAL_DAYS = 90;

function getDaysLeft(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return TOTAL_DAYS;
  const startDate = new Date(stored);
  const diffMs =
    startDate.getTime() + TOTAL_DAYS * 24 * 60 * 60 * 1000 - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function DeportationBanner() {

  const { t } = useTranslation()

  const isDone = localStorage.getItem(STORAGE_DONE_KEY) === "true";
  const daysLeft = getDaysLeft();
  const progress = ((TOTAL_DAYS - daysLeft) / TOTAL_DAYS) * 100;

  const urgency =
    isDone ? "done" : daysLeft <= 7 ? "critical" : daysLeft <= 30 ? "warning" : "safe";

  const label = {
    done: t('deportation-banner.done'),
    critical: t('deportation-banner.critical'),
    warning: t('deportation-banner.warning'),
    safe: t('deportation-banner.safe'),
  }[urgency];

  const emoji = { done: "✅", critical: "🚨", warning: "⚠️", safe: "🆗" }[urgency];

  return (
    <Link to="/deportation" className={`${styles.banner} ${styles[urgency]}`}>
      <div className={styles.left}>
        <span className={styles.emoji}>{emoji}</span>
        <div className={styles.text}>
          <span className={styles.label}>{label}</span>
          {!isDone && (
            <span className={styles.sub}>{t('deportation-banner.timer')}</span>
          )}
        </div>
      </div>

      <div className={styles.right}>
        {isDone ? (
          <span className={styles.doneText}>{t('deportation-banner.ready')}</span>
        ) : (
          <>
            <span className={styles.days}>{daysLeft}</span>
            <span className={styles.daysLabel}>{t('deportation-banner.days')}</span>
          </>
        )}
      </div>

      {!isDone && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}
    </Link>
  );
}

export default DeportationBanner;
