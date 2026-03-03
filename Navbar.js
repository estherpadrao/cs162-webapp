import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end>Board</NavLink>
      <NavLink to="/new">New Task</NavLink>
    </nav>
  );
}

export default Navbar;
