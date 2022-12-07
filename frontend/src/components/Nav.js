import { Link } from "react-router-dom";

function Nav() {
return (
<nav>
<Link to="/">Главная</Link>
<Link to="/tags">Теги</Link>
</nav>
)
}

export default Nav