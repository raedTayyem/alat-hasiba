import React from "react";
import { Helmet } from "react-helmet-async";
import "./ScientificCalculator.css";
import { evaluate, string } from "mathjs";

class ScientificCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equation: "",
      history: [],
    };
    this.handleEquationChange = this.handleEquationChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSolve = this.handleSolve.bind(this);
    this.updateState = this.updateState.bind(this);
    this.clearEquation = this.clearEquation.bind(this);
    this.bsEquation = this.bsEquation.bind(this);
  }

  updateState(newState) {
    this.setState(newState);
  }

  handleEquationChange(e) {
    // console.log(e.target.name)
    var copyHistory = [...this.state.history];
    this.updateState({ equation: e.target.name, history: copyHistory });
    // console.log(this.state.equation)
  }

  handleClick(e) {
    var focus = document.getElementById("mainInput");
    focus.click();
    var copyEquation = [...this.state.equation];
    copyEquation.push(e.target.name);
    copyEquation = copyEquation.join("");
    console.log(copyEquation);
    var copyHistory = [...this.state.history];
    this.updateState({ equation: copyEquation, history: copyHistory });
    // console.log(e.target.name)
  }

  handleSolve() {
    var copyEquation = this.state.equation;
    var copyHistory = [...this.state.history];
    console.log("history:", this.state.history);
    var res = string(evaluate(copyEquation));
    copyHistory.push(copyEquation + "=" + res);
    // console.log(copyHistory)
    this.updateState({
      equation: res,
      history: copyHistory,
    });
  }

  clearEquation() {
    var copyHistory = this.state.history;
    if (this.state.equation === "") {
      copyHistory = [];
    }
    this.updateState({ equation: "", history: copyHistory });
  }

  bsEquation() {
    var copyEquation = [...this.state.equation];
    copyEquation = copyEquation.slice(0, copyEquation.length - 1).join("");
    var copyHistory = this.state.history;
    this.updateState({ equation: copyEquation, history: copyHistory });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>آلة حاسبة علمية</title>
          <meta
            name="description"
            content="الآلة الحاسبة العلمية هي جهاز يوفر حسابات رياضية متقدمة."
          />
          <link rel="canonical" href="/ScientificCalculator" />
        </Helmet>
        <div className="main-app">
          <div>
            <h2>آلة حاسبة علمية</h2>
            <input
              className="input"
              id="mainInput"
              type={"text"}
              defaultValue={this.state.equation}
              onChange={this.handleEquationChange}
            />
            <div className="numpad">
              <button className="calcBtn" name="pi" onClick={this.handleClick}>
                &pi;
              </button>
              <button
                className="calcBtn"
                name="abs("
                onClick={this.handleClick}
              >
                abs
              </button>
              <button
                className="calcBtn"
                name="exp("
                onClick={this.handleClick}
              >
                exp
              </button>
              <button className="calcBtn" onClick={this.clearEquation}>
                C
              </button>
              <button className="calcBtn" onClick={this.bsEquation}>
                AC
              </button>
              <button
                className="calcBtn"
                name="sin("
                onClick={this.handleClick}
              >
                sin
              </button>
              <button className="calcBtn" name="(" onClick={this.handleClick}>
                (
              </button>
              <button className="calcBtn" name=")" onClick={this.handleClick}>
                )
              </button>
              <button
                className="calcBtn"
                name="factorial("
                onClick={this.handleClick}
              >
                !
              </button>
              <button className="calcBtn" name="/" onClick={this.handleClick}>
                /
              </button>
              <button
                className="calcBtn"
                name="cos("
                onClick={this.handleClick}
              >
                cos
              </button>
              <button className="calcBtn" name="7" onClick={this.handleClick}>
                7
              </button>
              <button className="calcBtn" name="8" onClick={this.handleClick}>
                8
              </button>
              <button className="calcBtn" name="9" onClick={this.handleClick}>
                9
              </button>
              <button className="calcBtn" name="*" onClick={this.handleClick}>
                X
              </button>
              <button
                className="calcBtn"
                name="tan("
                onClick={this.handleClick}
              >
                tan
              </button>
              <button className="calcBtn" name="4" onClick={this.handleClick}>
                4
              </button>
              <button className="calcBtn" name="5" onClick={this.handleClick}>
                5
              </button>
              <button className="calcBtn" name="6" onClick={this.handleClick}>
                6
              </button>
              <button className="calcBtn" name="-" onClick={this.handleClick}>
                &#8722;
              </button>
              <button
                className="calcBtn"
                name="log("
                onClick={this.handleClick}
              >
                log
              </button>
              <button className="calcBtn" name="1" onClick={this.handleClick}>
                1
              </button>
              <button className="calcBtn" name="2" onClick={this.handleClick}>
                2
              </button>
              <button className="calcBtn" name="3" onClick={this.handleClick}>
                3
              </button>
              <button className="calcBtn" name="+" onClick={this.handleClick}>
                +
              </button>
              <button className="calcBtn" name="ln(" onClick={this.handleClick}>
                ln
              </button>
              <button className="calcBtn" name="^" onClick={this.handleClick}>
                x^y
              </button>
              <button className="calcBtn" name="0" onClick={this.handleClick}>
                0
              </button>
              <button className="calcBtn" name="." onClick={this.handleClick}>
                .
              </button>
              <button className="calcBtn" name="=" onClick={this.handleSolve}>
                =
              </button>
            </div>
          </div>
          <h3>
            الآلة الحاسبة العلمية هي جهاز يوفر حسابات رياضية متقدمة. تم تصميم
            الآلة الحاسبة للاستخدام في العلوم والهندسة والرياضيات. . تم تطوير
            الآلات الحاسبة العلمية الأولى في أوائل القرن التاسع عشر بواسطة جيمس
            وات ومايكل فاراداي.
          </h3>
        </div>
      </>
    );
  }
}

export default ScientificCalculator;
