import React from 'react'
import { NavLink } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      Oooops...The page you are looking for is not yet present :/
      <div>
      <button><NavLink to={"/"}>Go to Home Page</NavLink></button>
      </div>
    </div>
  )
}

export default NotFound
