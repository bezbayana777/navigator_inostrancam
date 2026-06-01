
import { useTranslation } from 'react-i18next';
import styles from './Styles.module.scss';
import { Link } from 'react-router';

function NotFoundPageComponent() {

  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <h2 className={styles.container__error_code}>{t('not-found-page.error-code')}</h2>
      <p className={styles.container__error_message}>{t('not-found-page.error-message')}</p>
      <Link to={'/'} className={styles.container__link}>{t('not-found-page.return')}</Link>

    </div>
  );
}

export const NotFoundPage = NotFoundPageComponent