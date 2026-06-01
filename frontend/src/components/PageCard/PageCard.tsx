import classes from "./Styles.module.scss"

interface PageCardProps {
  step_id: number;
  title: string;
  icon_link: string;
  description?: string; 
  onClick?: () => void; 
}

function PageCard({ step_id, title, icon_link, description, onClick }: PageCardProps) {
  return (
    <div className={classes.page_card} onClick={onClick}>
      <div className={classes.page_card_top}>
        <div className={classes.page_card_iconWrapper}>
          <img 
            className={classes.page_card_img} 
            src={icon_link} 
            alt={`Иконка для ${title}`}
            loading="lazy" 
          />
        </div>
        
        <div className={classes.page_card_content}>
          <div className={classes.page_card_header}>
            <span className={classes.page_card_step}>Шаг {step_id}</span>
          </div>
          
          <h3 className={classes.page_card_title}>{title}</h3>
          
          {description && (
            <p className={classes.page_card_description}>{description}</p>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default PageCard