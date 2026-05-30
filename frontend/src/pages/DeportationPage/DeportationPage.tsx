import { useEffect, useState, useCallback, useTransition } from "react";
import styles from "./Styles.module.scss";
import { useTranslation } from "react-i18next";
import RegistrationPopup from "../../Popups/RegistrationPopup/RegistrationPopup";

const STORAGE_KEY = "deportation_start_date";
const STORAGE_DONE_KEY = "deportation_done";
const TOTAL_DAYS = 90;

function getStartDate(): Date {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return new Date(stored);
  const now = new Date();
  localStorage.setItem(STORAGE_KEY, now.toISOString());
  return now;
}

function getDaysLeft(startDate: Date): number {
  const now = new Date();
  const diffMs = startDate.getTime() + TOTAL_DAYS * 24 * 60 * 60 * 1000 - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function sendNotification(daysLeft: number) {
  

  if (!("Notification" in window) || Notification.permission !== "granted") return;

  let message = "";
  if (daysLeft <= 0) {
    message = ''
  } else if (daysLeft <= 7) {
    message = ''
  } else if (daysLeft <= 14) {
    message = ''
  } else if (daysLeft <= 30) {
    message = ''
  } else {
    message = ''
  }

  new Notification("UrFU - notification about registration", {
    body: message,
    icon: "/favicon.ico",
  });
}

function DeportationTimerPage() {
  
  const {t} = useTranslation()
  const [startDate] = useState<Date>(getStartDate);
  const [daysLeft, setDaysLeft] = useState<number>(() => getDaysLeft(getStartDate()));
  const [isDone, setIsDone] = useState<boolean>(
    () => localStorage.getItem(STORAGE_DONE_KEY) === "true"
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifGranted, setNotifGranted] = useState(
    () => "Notification" in window && Notification.permission === "granted"
  );


  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      setDaysLeft(getDaysLeft(startDate));
    }, 60_000);
    return () => clearInterval(interval);
  }, [startDate, isDone]);


  useEffect(() => {
    if (isDone) return;
    if (Notification.permission === "granted") {
      sendNotification(daysLeft);
    }
  }, []); 

  const handleRequestNotif = useCallback(async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotifGranted(true);
      sendNotification(daysLeft);
    }
  }, [daysLeft]);

  const handleDone = () => {
    localStorage.setItem(STORAGE_DONE_KEY, "true");
    setIsDone(true);
    setShowConfirm(false);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_DONE_KEY);
    window.location.reload();
  };

  const progress = isDone ? 100 : ((TOTAL_DAYS - daysLeft) / TOTAL_DAYS) * 100;

  const urgencyClass =
    isDone
      ? styles.safe
      : daysLeft <= 7
      ? styles.critical
      : daysLeft <= 30
      ? styles.warning
      : styles.safe;

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = isDone
    ? 0
    : circumference - (progress / 100) * circumference;

  return (
    <>
      <div className={`${styles.page} ${urgencyClass}`}>
        <div className={styles.bg} aria-hidden />

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isDone ? t('deportation-page.ready-registration') : t('deportation-page.staying')}
            </h1>
            <p className={styles.subtitle}>
              {isDone
                ? t('deportation-page.isDone-true')
                : t('deportation-page.isDone-false')}
            </p>
          </div>

          <div className={styles.timerWrapper}>
            <svg className={styles.ring} viewBox="0 0 280 280">
              <circle
                cx="140" cy="140" r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className={styles.ringTrack}
              />
              <circle
                cx="140" cy="140" r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={styles.ringProgress}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>

            <div className={styles.timerInner}>
              {isDone ? (
                <span className={styles.doneIcon}>✓</span>
              ) : (
                <>
                  <span className={styles.daysNumber}>{daysLeft}</span>
                  <span className={styles.daysLabel}>{t('deportation-page.days')}</span>
                </>
              )}
            </div>
          </div>

          {!isDone && (
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.progressLabels}>
                <span>Въезд</span>
                <span>{Math.round(progress)}% {t('deportation-page.went')}</span>
                <span>{t('deportation-page.90days')}</span>
              </div>
            </div>
          )}

          {!isDone && (
            <div className={styles.cards}>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📅</span>
                <span className={styles.cardLabel}>{t('deportation-page.entry')}</span>
                <span className={styles.cardValue}>
                  {startDate.toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>⏳</span>
                <span className={styles.cardLabel}>{t('deportation-page.deadline')}</span>
                <span className={styles.cardValue}>
                  {new Date(
                    startDate.getTime() + TOTAL_DAYS * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>
                  {daysLeft <= 7 ? "🚨" : daysLeft <= 30 ? "⚠️" : "✅"}
                </span>
                <span className={styles.cardLabel}>{t('deportation-page.status')}</span>
                <span className={styles.cardValue}>
                  {daysLeft <= 7
                    ? t("deportation-page.urgent")
                    : daysLeft <= 30
                    ? t("deportation-page.hurry")
                    : t("deportation-page.ok")}
                </span>
              </div>
            </div>
          )}

          {"Notification" in window && !notifGranted && !isDone && (
            <button className={styles.notifBtn} onClick={handleRequestNotif}>
              🔔 {t('deportation-page.enable-notification')}
            </button>
          )}

          <div className={styles.actions}>
            {!isDone ? (
              <button
                className={styles.doneBtn}
                onClick={() => setShowConfirm(true)}
              >
                ✓ {t('deportation-page.registration-success')}
              </button>
            ) : (
              <div className={styles.doneCard}>
                <p className={styles.doneText}>
                  {t('deportation-page.timer-success')} 🎉
                </p>
                <button className={styles.resetBtn} onClick={handleReset}>
                  {t('deportation-page.reset')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Модалка подтверждения */}
        {showConfirm && <RegistrationPopup setShowConfirm={setShowConfirm} handleDone={handleDone} />}
      </div>
    </>
  );
}

export default DeportationTimerPage;