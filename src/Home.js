import React from 'react'
import SliderComponent from './Components/ImageSlider/ImageSlider'
import LandList from './Components/LandList/LandList'
import Categories from './Components/Categories/Categories'
import Reviews from './Components/Reviews/Reviews'

export default function () {
  return (
    <div>
        <SliderComponent/>
        <LandList/>
        <Categories/>
        <Reviews/>
    </div>
  )
}
