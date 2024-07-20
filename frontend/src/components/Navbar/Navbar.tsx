import { Link } from 'react-router-dom'
import './Navbar.scss'

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to='/'>
        <h1>Placement Cell</h1>
      </Link>
    </div>
  )
}

export default Navbar
