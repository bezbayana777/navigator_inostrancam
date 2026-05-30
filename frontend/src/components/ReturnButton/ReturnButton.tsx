import { Link } from "react-router"
import Button from "../../components/UI/Button/Button"
import styles from "./Styles.module.scss"
import arrow_back from '../../assets/arrow_back.svg'




function BasePage() {


  return (
    <> 
      <div className={styles.return_button}>
        <Link to="/"><Button src={arrow_back}/></Link>
      </div>
    </>
   )
  }
  
export default BasePage