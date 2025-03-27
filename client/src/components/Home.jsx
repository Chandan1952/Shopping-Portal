import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Discover from './Discover'
import DiscoverImage from './DiscoverImage'
import ShopByCategory from './ShopByCategory'


export default function Home() {
  return (
    <div>
      <Header></Header>
      <Discover></Discover>
      <DiscoverImage></DiscoverImage>
      <ShopByCategory></ShopByCategory>
      <Footer></Footer>
    </div>
  )
}
