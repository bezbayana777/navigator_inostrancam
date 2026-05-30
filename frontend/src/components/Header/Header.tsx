import { useTranslation } from "react-i18next"
import Select from "../Select/Select"
import styles from "./Styles.module.scss"
import { Link } from 'react-router'

function Header() {

  const {t} = useTranslation()

  return (
    <header className={styles.header}>
      <Select  />
      <Link className={styles.header__link} to="/login">   
        <button className={styles.header__button} type="button">{t('button.enter')}</button>
      </Link>

    </header>
  )
}

export default Header