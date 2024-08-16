import { Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  return (
    <div className="container">
      <header className="header">
        <h1>Building Bridges Between Talent and Opportunity</h1>
        <h2>Simplifying the recruitment process for companies and students</h2>
        <nav>
          <Link to="/login">LOGIN</Link>
          <Link to="/SignUp">SIGNUP</Link>
        </nav>
      </header>
    </div>
  );
};

export default Home;

// "Discover exciting placement opportunities from top companies."
// "Streamline your applications and manage them in one place."
// "Sharpen your interview skills with valuable resources and preparation tools."
// "Stay informed about upcoming recruitment drives and deadlines."

// "Find and connect with qualified talent from our diverse student pool."
// "Simplify the recruitment process with efficient tools and automation."
// "Reduce time-to-hire and identify the perfect fit for your company."
// "Gain access to a centralized platform for managing applications and interviews."
