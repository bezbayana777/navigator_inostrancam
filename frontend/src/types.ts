
type Checklist = {
  id: number,
  description: string
}


export type InfoCard = {
  title: string, 
  content: string,
  content_en: string,
  order: number,
  checklist: Checklist[],
  id: number,
  step_id: number
  }
