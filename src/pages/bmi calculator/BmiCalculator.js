import React from "react";
import { Helmet } from "react-helmet-async";
import "./BmiCalculator.css";

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bmi: "",
      info: "",
      height: "",
      weight: "",
    };
    this.handleBmi = this.handleBmi.bind(this);
  }

  handleBmi = () => {
    let val = (
      [
        Number(this.state.weight) /
          Number(this.state.height) /
          Number(this.state.height),
      ] * 10000
    ).toFixed(1);
    this.setState({ bmi: val });
    if (val < 18.5) {
      this.setState({ info: "تحت الوزن" });
    } else if (val > 18.5 && val <= 24.9) {
      this.setState({ info: "صحي" });
    } else if (val > 24.9 && val < 30) {
      this.setState({ info: "وزن زائد عن المطلوب" });
    } else {
      this.setState({ info: "سمين" });
    }
  };

  render() {
    return (
      <>
        <Helmet>
          <title>حاسبة مؤشر كتلة الجسم BMI</title>
          <meta
            name="description"
            content="مؤشر كتلة الجسم (BMI) هو ناتج تناسبي (نسبة معينة من الوزن صرف الطول مربعاً)"
          />
          <link rel="canonical" href="/BmiCalculator" />
        </Helmet>
        <div className="main-app">
          <div>
            <h2>حاسبة مؤشر كتلة الجسم BMI</h2>
            <input
              type="text"
              onChange={(e) => this.setState({ height: e.target.value })}
              placeholder="الارتفاع في سم"
            />
            <input
              type="text"
              onChange={(e) => this.setState({ weight: e.target.value })}
              placeholder="الوزن بالكيلوجرام"
            />
            <button onClick={this.handleBmi}>حسب</button>
            <h1>{this.state.bmi}</h1>
            <h2>{this.state.info}</h2>
          </div>
          <h3>
            مؤشر كتلة الجسم (BMI) هو ناتج تناسبي (نسبة معينة من الوزن صرف الطول
            مربعاً) ويستخدم لتقدير الوزن النسبي بالنسبة لنصف الطول. ويستخدم BMI
            لتحديد مستوى الخطورة المرتبط بالسمنة ومرض السكري وأمراض القلب . BMI
            يستخدم في العديد من الأحيان للتحقق من صحة بشرية لأشخاص معينين.{" "}
          </h3>
        </div>
      </>
    );
  }
}

export default Calculator;
