
import CardList from '../../components/CardList/CardList'
import Title from '../../components/Title/Title'
import Header from '../../components/Header/Header'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading'
import DeportationBanner from '../../components/DeportationBanner/DeportationBanner'



const API_URL = import.meta.env.VITE_API_URL



function MainPage() {

  const [cards, setCards] = useState()
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    fetch(`${API_URL}/steps`)
      .then(response => response.json())
      .then(data => {
        setCards(data);   
        setLoading(false)
      })
      .catch(err => {
        console.error('Ошибка:', err)
      });
  }, []);
  

  return (
    <>
      <Header />
      <Title />
      <DeportationBanner />
      {loading ? <Loading text={"Загрузка..."}/> : <CardList cardsData={cards}/>}
    </>
  )
}

export default MainPage