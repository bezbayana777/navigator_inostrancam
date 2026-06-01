import { useState } from "react";
import styles from "./Styles.module.scss";

const DOCUMENTS = [
  { id: "passport", label: "Паспорт" },
  { id: "passportTranslation", label: "Перевод паспорта" },
  { id: "migrationCard", label: "Миграционная карта" },
  { id: "dactyloscopy", label: "Карта о прохождении дактилоскопии" },
  { id: "registration", label: "Регистрация" },
  { id: "medicalCert", label: "Медицинское освидетельствование" },
  { id: "dmsPolicy", label: "Полис ДМС" },
  { id: "studentCard", label: "Студенческий билет" },
];

const QUEUE_OPTIONS = [
  { id: "noQueue", label: "Без очереди" },
  { id: "15min", label: "15 мин" },
  { id: "30min", label: "30 мин" },
  { id: "moreThanHour", label: "Больше часа" },
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

  const activeFlame = hoveredFlame || stressLevel;

  return (
    <div className={styles.overlay}>
      <div className={styles.form}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h2 className={styles.title}>Оставить отзыв</h2>
        <p className={styles.subtitle}>Помогите следующим студентам — расскажите о своём опыте</p>

        {/* Стресс */}
        <div className={styles.section}>
          <label className={styles.label}>Уровень стресса</label>
          <div className={styles.flames}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.flame} ${n <= activeFlame ? styles.flameActive : ""}`}
                onClick={() => setStressLevel(n)}
                onMouseEnter={() => setHoveredFlame(n)}
                onMouseLeave={() => setHoveredFlame(0)}
                aria-label={`Уровень стресса ${n}`}
              >
                🔥
              </button>
            ))}
            {stressLevel > 0 && (
              <span className={styles.flameLabel}>
                {["", "Спокойно", "Немного волновался", "Средний стресс", "Сильный стресс", "Очень стрессово"][stressLevel]}
              </span>
            )}
          </div>
        </div>

        {/* Очередь */}
        <div className={styles.section}>
          <label className={styles.label}>Время ожидания в очереди</label>
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

        {/* График */}
        <div className={styles.section}>
          <label className={styles.label}>График работы совпал с указанным?</label>
          <div className={styles.pills}>
            {(["yes", "no", "custom"] as const).map((val) => (
              <button
                key={val}
                type="button"
                className={`${styles.pill} ${scheduleMatch === val ? styles.pillActive : ""}`}
                onClick={() => setScheduleMatch(val)}
              >
                {val === "yes" ? "Да" : val === "no" ? "Нет" : "Свой вариант"}
              </button>
            ))}
          </div>
          {scheduleMatch === "custom" && (
            <input
              className={styles.input}
              placeholder="Опишите ситуацию..."
              value={scheduleCustom}
              onChange={(e) => setScheduleCustom(e.target.value)}
            />
          )}
        </div>

        {/* Документы */}
        <div className={styles.section}>
          <label className={styles.label}>Какие документы понадобились?</label>
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
          Отправить отзыв
        </button>
      </div>
    </div>
  );
}

export default ReviewForm;
