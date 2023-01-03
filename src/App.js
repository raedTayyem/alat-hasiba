import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScientificCalculator from "./pages/scientific calculator/ScientificCalculator";
import Calculator from "./pages/calculator/Calculator";
import InvestmentCalculator from "./pages/investment calculator/InvestmentCalculator";
import BmiCalculator from "./pages/bmi calculator/BmiCalculator";
import AgeCalculator from "./pages/age calculator/AgeCalculator";
import NetSpeed from "./pages/net speed/NetSpeed";
import CurrencyConversion from "./pages/currency convertor/CurrencyConversion";

import Navbar from "./cmps/navbar/Navbar";

import "./App.css";

export default function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="Calculator" element={<Calculator />} />
            <Route
              path="ScientificCalculator"
              element={<ScientificCalculator />}
            />
            <Route
              path="InvestmentCalculator"
              element={<InvestmentCalculator />}
            />
            <Route path="BmiCalculator" element={<BmiCalculator />} />
            <Route path="كيف احسب عمري" element={<AgeCalculator />} />
            <Route path="NetSpeed" element={<NetSpeed />} />
            <Route path="CurrencyConversion" element={<CurrencyConversion />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
