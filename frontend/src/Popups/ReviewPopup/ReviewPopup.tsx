import { useState } from "react";
import styles from "./Styles.module.scss";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const RU_DOCUMENTS = [
  { id: "passport", label: "Паспорт" },
  { id: "passportTranslation", label: "Перевод паспорта" },
  { id: "migrationCard", label: "Миграционная карта" },
  { id: "dactyloscopy", label: "Карта о прохождении дактилоскопии" },
  { id: "registration", label: "Регистрация" },
  { id: "medicalCert", label: "Медицинское освидетельствование" },
  { id: "dmsPolicy", label: "Полис ДМС" },
  { id: "studentCard", label: "Студенческий билет" },
];

const EN_DOCUMENTS = [
  { id: "passport", label: "Passport" },
  { id: "passportTranslation", label: "Passport Translation" },
  { id: "migrationCard", label: "Migration Card" },
  { id: "dactyloscopy", label: "Dactyloscopy Card" },
  { id: "registration", label: "Registration" },
  { id: "medicalCert", label: "Medical Examination Certificate" },
  { id: "dmsPolicy", label: "Voluntary Health Insurance Policy" },
  { id: "studentCard", label: "Student ID Card" },
];

const ZH_DOCUMENTS = [
  { id: "passport", label: "护照" },
  { id: "passportTranslation", label: "护照翻译件" },
  { id: "migrationCard", label: "移民卡" },
  { id: "dactyloscopy", label: "指纹登记卡" },
  { id: "registration", label: "居留登记" },
  { id: "medicalCert", label: "体检证明" },
  { id: "dmsPolicy", label: "自愿医疗保险单" },
  { id: "studentCard", label: "学生证" },
];

const RU_QUEUE_OPTIONS = [
  { id: "noQueue", label: "Без очереди" },
  { id: "15min", label: "15 мин" },
  { id: "30min", label: "30 мин" },
  { id: "moreThanHour", label: "Больше часа" },
];

const EN_QUEUE_OPTIONS = [
  { id: "noQueue", label: "No queue" },
  { id: "15min", label: "15 min" },
  { id: "30min", label: "30 min" },
  { id: "moreThanHour", label: "More than an hour" },
];

const ZH_QUEUE_OPTIONS = [
  { id: "noQueue", label: "无需排队" },
  { id: "15min", label: "15分钟" },
  { id: "30min", label: "30分钟" },
  { id: "moreThanHour", label: "超过一小时" },
];



export type ReviewFormData = {
  stressLevel: number;
  queueTime: string;
  scheduleMatch: "yes" | "no" | "custom";
  scheduleCustom: string;
  documents: string[];
};

type ReviewFormProps = {
  onSubmit: (data: ReviewFormData) => void;
  onClose: () => void;
};

function ReviewForm({ onSubmit, onClose }: ReviewFormProps) {
  const [stressLevel, setStressLevel] = useState(0);
  const [hoveredFlame, setHoveredFlame] = useState(0);
  const [queueTime, setQueueTime] = useState("");
  const [scheduleMatch, setScheduleMatch] = useState<"yes" | "no" | "custom" | "">("");
  const [scheduleCustom, setScheduleCustom] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);

  const isValid =
    stressLevel > 0 &&
    queueTime !== "" &&
    scheduleMatch !== "" &&
    (scheduleMatch !== "custom" || scheduleCustom.trim() !== "");

  const handleDocumentToggle = (id: string) => {
    setDocuments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      stressLevel,
      queueTime,
      scheduleMatch: scheduleMatch as "yes" | "no" | "custom",
      scheduleCustom,
      documents,
    });
  };

  const { i18n } =useTranslation()

  const DOCUMENTS = i18n.language === 'ru' ? RU_DOCUMENTS : i18n.language === 'en' ? EN_DOCUMENTS : ZH_DOCUMENTS

  const QUEUE_OPTIONS = i18n.language === 'ru' ? RU_QUEUE_OPTIONS : i18n.language === 'en' ? EN_QUEUE_OPTIONS : ZH_QUEUE_OPTIONS

  const activeFlame = hoveredFlame || stressLevel;

  return (
    <div className={styles.overlay}>
      <div className={styles.form}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h2 className={styles.title}>{t('review-popup.review')}</h2>
        <p className={styles.subtitle}>{t('review-popup.review-subtitle')}</p>

        <div className={styles.section}>
          <label className={styles.label}>{t('review-popup.stress-level')}</label>
          <div className={styles.flames}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.flame} ${n <= activeFlame ? styles.flameActive : ""}`}
                onClick={() => setStressLevel(n)}
                onMouseEnter={() => setHoveredFlame(n)}
                onMouseLeave={() => setHoveredFlame(0)}
                aria-label={`${t('review-popup.stress-level')} ${n}`}
              >
                🔥
              </button>
            ))}
            {stressLevel > 0 && (
              <span className={styles.flameLabel}>
                {["", t('review-popup.stress-lvl-1'), t('review-popup.stress-lvl-2'), t('review-popup.stress-lvl-3'), t('review-popup.stress-lvl-4'), t('review-popup.stress-lvl-5')][stressLevel]}
              </span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>{t('review-popup.queue')}</label>
          <div className={styles.pills}>
            {QUEUE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.pill} ${queueTime === opt.id ? styles.pillActive : ""}`}
                onClick={() => setQueueTime(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>{t('review-popup.graphics-question')}</label>
          <div className={styles.pills}>
            {(["yes", "no", "custom"] as const).map((val) => (
              <button
                key={val}
                type="button"
                className={`${styles.pill} ${scheduleMatch === val ? styles.pillActive : ""}`}
                onClick={() => setScheduleMatch(val)}
              >
                {val === "yes" ? t('review-popup.yes') : val === "no" ? t('review-popup.no') : t('review-popup.custom')}
              </button>
            ))}
          </div>
          {scheduleMatch === "custom" && (
            <input
              className={styles.input}
              placeholder={t('review-popup.hint')}
              value={scheduleCustom}
              onChange={(e) => setScheduleCustom(e.target.value)}
            />
          )}
        </div>

        <div className={styles.section}>
          <label className={styles.label}>{t('review-popup.docs-question')}</label>
          <div className={styles.checkboxGrid}>
            {DOCUMENTS.map((doc) => (
              <label key={doc.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={documents.includes(doc.id)}
                  onChange={() => handleDocumentToggle(doc.id)}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxCustom}>
                  {documents.includes(doc.id) && <span className={styles.checkmark}>✓</span>}
                </span>
                <span className={styles.checkboxText}>{doc.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          className={`${styles.submitBtn} ${!isValid ? styles.submitBtnDisabled : ""}`}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          {t('review-popup.submit')}
        </button>
      </div>
    </div>
  );
}

export default ReviewForm;
