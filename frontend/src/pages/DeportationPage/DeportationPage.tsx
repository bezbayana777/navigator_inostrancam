import { useEffect, useState, useCallback } from "react";
import styles from "./Styles.module.scss";
import BasePage from "../BasePage/BasePage";

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
    message = "⚠️ Срок пребывания истёк! Немедленно обратитесь в миграционный отдел.";
  } else if (daysLeft <= 7) {
    message = `🚨 Осталось всего ${daysLeft} дн. до истечения срока пребывания!`;
  } else if (daysLeft <= 14) {
    message = `⚠️ До истечения срока пребывания осталось ${daysLeft} дней. Не затягивайте!`;
  } else if (daysLeft <= 30) {
    message = `📅 До истечения срока пребывания осталось ${daysLeft} дней.`;
  } else {
    message = `✅ До истечения срока пребывания осталось ${daysLeft} дней.`;
  }

  new Notification("УрФУ — Напоминание о регистрации", {
    body: message,
    icon: "/favicon.ico",
  });
}

function DeportationTimerPage() {
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
      <BasePage />
      <div className={`${styles.page} ${urgencyClass}`}>
        <div className={styles.bg} aria-hidden />

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isDone ? "Регистрация оформлена" : "Срок пребывания"}
            </h1>
            <p className={styles.subtitle}>
              {isDone
                ? "Вы успешно прошли все этапы оформления"
                : "Дней до истечения разрешённого срока пребывания"}
            </p>
          </div>

          {/* Круговой таймер */}
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
                  <span className={styles.daysLabel}>дней</span>
                </>
              )}
            </div>
          </div>

          {/* Прогресс-полоска */}
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
                <span>{Math.round(progress)}% прошло</span>
                <span>90 дней</span>
              </div>
            </div>
          )}

          {/* Статус-карточки */}
          {!isDone && (
            <div className={styles.cards}>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📅</span>
                <span className={styles.cardLabel}>Дата въезда</span>
                <span className={styles.cardValue}>
                  {startDate.toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>⏳</span>
                <span className={styles.cardLabel}>Крайняя дата</span>
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
                <span className={styles.cardLabel}>Статус</span>
                <span className={styles.cardValue}>
                  {daysLeft <= 7
                    ? "Срочно!"
                    : daysLeft <= 30
                    ? "Торопитесь"
                    : "Всё ок"}
                </span>
              </div>
            </div>
          )}

          {/* Уведомления */}
          {"Notification" in window && !notifGranted && !isDone && (
            <button className={styles.notifBtn} onClick={handleRequestNotif}>
              🔔 Включить напоминания
            </button>
          )}

          {/* Кнопки */}
          <div className={styles.actions}>
            {!isDone ? (
              <button
                className={styles.doneBtn}
                onClick={() => setShowConfirm(true)}
              >
                ✓ Я получил регистрацию и прописку
              </button>
            ) : (
              <div className={styles.doneCard}>
                <p className={styles.doneText}>
                  Таймер остановлен. Ваши документы в порядке 🎉
                </p>
                <button className={styles.resetBtn} onClick={handleReset}>
                  Сбросить (въехал заново)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Модалка подтверждения */}
        {showConfirm && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmModal}>
              <h3 className={styles.confirmTitle}>Подтвердите действие</h3>
              <p className={styles.confirmText}>
                Вы уверены, что получили все необходимые документы?
                <br />
                <strong>Регистрацию и прописку</strong> по месту проживания?
              </p>
              <div className={styles.confirmActions}>
                <button className={styles.confirmYes} onClick={handleDone}>
                  Да, всё готово
                </button>
                <button
                  className={styles.confirmNo}
                  onClick={() => setShowConfirm(false)}
                >
                  Нет, отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DeportationTimerPage;