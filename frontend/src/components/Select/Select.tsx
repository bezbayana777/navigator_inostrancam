
import styles from './Styles.module.scss'


export interface SelectProps {
  setLanguage: (language: string) => void
}

import { useTranslation } from 'react-i18next';

function Select() {
  const { i18n } = useTranslation();

  return (
    <select
      className={styles.select}
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="ru">Русский</option>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
}
export default Select;