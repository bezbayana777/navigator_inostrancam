
import { useTranslation } from 'react-i18next';
import classes from './Styles.module.scss'

function Header() {

  const { t } = useTranslation();

  return (
    <header className={classes.header}>
      <h1 className={classes.title}>{t('mainPage.title')}</h1>
      <h3 className={classes.subtitle}>{t('mainPage.subtitle')}</h3>
    </header>
  )
}

export default Header