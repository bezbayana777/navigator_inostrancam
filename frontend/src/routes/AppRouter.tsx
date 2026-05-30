import PlanePage from '../pages/PlanePage/PlanePage'
import { Route, Routes } from 'react-router'

import MainPage from '../pages/MainPage/MainPage'

import InitialCheckInPage from '../pages/InitialCheckInPage/InitialCheckInPage'
import LongRegistrationPage from '../pages/LongRegistrationPage/LongRegistrationPage'

import  Login  from '../pages/Login/Login'
import { useState } from 'react'

import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage'
import Registration from '../pages/Registration/Registration'
import DormitoryPage from '../pages/DormitoryPage/DormitoryPage'
import VNJPage from '../pages/VNJPage/VNJPage'
import FaqPage from '../pages/FAQ/FaqPage'
import DeportationTimerPage from '../pages/DeportationPage/DeportationPage'
import PlaneMapPage from '../pages/Maps/PlaneMapPage.tsx/PlaneMapPage'


// const API_URL = import.meta.env.VITE_API_URL

function AppRouter() {

  const navigationRoutes = [
    {path: "/", page: <MainPage />},
    {path: "/plane", page: <PlanePage/>},
    {path: "/check-in", page: <InitialCheckInPage />},
    {path: "/dorm", page: <DormitoryPage />},
    {path: "/long-registration", page: <LongRegistrationPage/>},
    {path: "/vnj", page: <VNJPage />},
    {path: "/faq", page: <FaqPage />},
    {path: "/login", page: <Login />},
    {path: "/registration", page: <Registration />},
    {path: "/deportation", page: <DeportationTimerPage />},
    {path: "/*", page: <NotFoundPage/>},
    { path: "/plane/map", page: <PlaneMapPage /> }
  ]

  return (
    <>
      <Routes>
        {navigationRoutes.map(route => <Route key={route.path} path={route.path} element={route.page}/>)}
      </Routes>
    </>
  )
}

export default AppRouter;