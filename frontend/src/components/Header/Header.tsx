import { useTranslation } from "react-i18next"
import Select from "../Select/Select"
import styles from "./Styles.module.scss"
import { Link } from 'react-router'
import { useAuth } from "../../Services/AuthContext"  

function Header() {
  const { t } = useTranslation()
  const { isAuthenticated, logout } = useAuth()  

  return (
    <header className={styles.header}>
      <Select />
      
      {!isAuthenticated ? (
        <Link className={styles.header__link} to="/login">   
          <button className={styles.header__button} type="button">
            {t('button.login')}
          </button>
        </Link>
      ) : (
        <button 
          className={styles.header__button} 
          type="button"
          onClick={logout}
        >
          {t('button.logout')}
        </button>
      )}
    </header>
  )
}

export default Header