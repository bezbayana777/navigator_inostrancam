
import { useTranslation } from "react-i18next";
import styles from "./Styles.module.scss";

type RegistrationPopupProps = {
  setShowConfirm: (show: boolean) => void;
  handleDone: () => void;
};

export default function RegistrationPopup({setShowConfirm, handleDone}: RegistrationPopupProps) {
  
  const { t } = useTranslation()
  
  return (
    <div className={styles.confirmOverlay}>
            <div className={styles.confirmModal}>
              <h3 className={styles.confirmTitle}>{t('registration-popup.confirm')}</h3>
              <p className={styles.confirmText}>
                {t('registration-popup.confirm-question-1')}
                <br />
                {t('registration-popup.confirm-question-2')}
              </p>
              <div className={styles.confirmActions}>
                <button className={styles.confirmYes} onClick={handleDone}>
                  {t('registration-popup.confirm-yes')}
                </button>
                <button
                  className={styles.confirmNo}
                  onClick={() => setShowConfirm(false)}
                >
                  {t('registration-popup.confirm-no')}
                </button>
              </div>
            </div>
          </div>
  );
}