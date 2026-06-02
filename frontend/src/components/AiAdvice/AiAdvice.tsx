import { useState } from "react";
import styles from "./Styles.module.scss";
import ReactMarkdown from "react-markdown";

const API_URL = import.meta.env.VITE_API_URL;

type AiAdviceProps = {
  stepId: number;
};

type AiResponse = {
  analysis: string;
};

function AiAdvice({ stepId }: AiAdviceProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAdvice = async () => {
    if (advice) {
      setIsOpen(prev => !prev);
      return;
    }

    setLoading(true);
    setError(false);
    setIsOpen(true);

    try {
      const response = await fetch(`${API_URL}/ai/analyze-step/${stepId}?days=30`);
      if (!response.ok) throw new Error();
      const data: AiResponse = await response.json();
      if (!data.analysis) {
        setAdvice("ИИ не смог дать совет по этому шагу — пока недостаточно отзывов.");
      } else {
        setAdvice(data.analysis);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.trigger} onClick={fetchAdvice}>
        <span className={styles.triggerIcon}>✨</span>
        <span className={styles.triggerText}>
          {isOpen ? "Скрыть совет ИИ" : "Получить совет от ИИ"}
        </span>
        <span className={`${styles.triggerArrow} ${isOpen ? styles.triggerArrowOpen : ""}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          {loading && (
            <div className={styles.loading}>
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
              <span className={styles.loadingText}>ИИ анализирует шаг...</span>
            </div>
          )}

          {error && !loading && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>Не удалось получить ответ. Попробуйте позже.</span>
              <button
                className={styles.retryBtn}
                onClick={() => {
                  setAdvice(null);
                  fetchAdvice();
                }}
              >
                Повторить
              </button>
            </div>
          )}

          {advice && !loading && (
            <div className={styles.advice}>
              <div className={styles.adviceHeader}>
                <span className={styles.adviceIcon}>🤖</span>
                <span className={styles.adviceLabel}>Совет ИИ</span>
              </div>
              <div className={styles.adviceText}>
                <ReactMarkdown>{advice}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AiAdvice;
