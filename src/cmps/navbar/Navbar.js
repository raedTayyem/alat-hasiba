import { Outlet, Link } from "react-router-dom";
import "./Navbar.scss";

const NavBar = () => {
  return (
    <>
      <nav className="navbar">
        <ul className="navbar__list">
          <li className="navbar__item">
            <Link to="/Calculator">آلة حاسبة</Link>
          </li>
          <li className="navbar__item">
            <Link to="/ScientificCalculator">آلة حاسبة علمية</Link>
          </li>
          <li className="navbar__item">
            <Link to="/InvestmentCalculator">حاسبة الاستثمار</Link>
          </li>
          <li className="navbar__item">
            <Link to="/BmiCalculator">حاسبة مؤشر كتلة الجسم BMI</Link>
          </li>
          <li className="navbar__item">
            <Link to="/كيف احسب عمري">حساب العمر</Link>
          </li>
          <li className="navbar__item">
            <Link to="/NetSpeed"> قياس سرعة الإنترنت</Link>
          </li>{" "}
          <li className="navbar__item">
            <Link to="/CurrencyConversion"> تحويل عملات</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default NavBar;
