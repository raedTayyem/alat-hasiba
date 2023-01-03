import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import "./AgeCalculator.scss";
import Person from "./Person";

export default class AgeCalculator extends Component {
  constructor() {
    super();
    this.units = {
      milliseconds: {
        factor: 1,
        label: "مللي ثانية",
      },
      seconds: {
        factor: 1000,
        label: "ثانية",
      },
      minutes: {
        factor: 1000 * 60,
        label: "دقيقة",
      },
      hours: {
        factor: 1000 * 60 * 60,
        label: "ساعة",
      },
      days: {
        factor: 1000 * 60 * 60 * 24,
        label: "يوم",
      },
      weeks: {
        factor: 1000 * 60 * 60 * 24 * 7,
        label: "أسبوع",
      },
      months: {
        factor: 1000 * 60 * 60 * 24 * 30.4,
        label: "شهر",
      },
      years: {
        factor: 1000 * 60 * 60 * 24 * 365,
        label: "عام",
      },
      marsyears: {
        factor: 1000 * 60 * 60 * 24 * 687,
        label: "عام مريخي",
      },
    };
    this.state = { persons: [] };
  }

  componentDidMount() {
    this.handleUnitChange();
  }

  submit = (event) => {
    event.preventDefault();
    var name = document.querySelector("[name=name]").value;
    var birthDate = document.querySelector("[name=birthday]").value;
    var birthTime = document.querySelector("[name=birthtime]").value;
    var hash = Math.random() * 10000000000000000;
    var persons = this.state.persons.concat(
      <Person
        key={hash}
        id={hash}
        name={name}
        birthDate={birthDate}
        birthTime={birthTime}
        getFactor={this.getFactor}
        getUnitLabel={this.getUnitLabel}
        remove={() => {
          this.removePerson(hash);
        }}
      />
    );

    this.setState({
      persons,
    });

    document.getElementById("form").reset();
  };

  removePerson(id) {
    var really = window.confirm(
      `هل تريد إزالة ${
        this.state.persons.find((person) => person.props.id === id).props.name
      } من القائمة?`
    );
    if (really) {
      var persons = this.state.persons.filter(
        (person) => person.props.id !== id
      );
      this.setState({
        persons,
      });
    }
  }

  getFactor = () => {
    return this.units[this.state.unit].factor;
  };

  getUnitLabel = () => {
    return this.units[this.state.unit].label;
  };

  handleUnitChange = () => {
    var unit = document.querySelector("[name=unit]").value;
    this.setState({
      unit,
    });
  };

  render() {
    return (
      <>
      <Helmet>
        <title>حساب العمر</title>
        <meta name="description" content="الحياة مغامرة لكل شخص" />
        <link rel="canonical" href="/كيف احسب عمري" />
      </Helmet>
      <div className="main-app">
        <div className="AgeCalculator" onSubmit={this.submit}>
          <h1>آلة حاسبة العمر</h1>
          <div className="forms">
            <form id="form">
              <label>
                <span>الاسم: </span>
                <input type="text" name="name" required />
              </label>
              <label>
                <span>عيد الميلاد: </span>
                <input type="date" name="birthday" required />
                <input type="time" name="birthtime" required />
              </label>
              <div className="formFooter">
                <button type="submit" className="submit">
                  <span role="img" aria-labelledby="Add">
                    ➕ اضافه
                  </span>
                </button>
                <button type="reset" className="reset">
                  {" "}
                  <span role="img" aria-labelledby="Reset">
                    🔃
                  </span>{" "}
                  إعادة تعيين
                </button>
              </div>
            </form>
            <form>
              <label>
                <span>وحدة: </span>
                <select name="unit" onChange={this.handleUnitChange}>
                  {Object.entries(this.units).map(([key, value]) => (
                    <option value={key} name={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </label>
            </form>
          </div>
          <div className="persons">
            {this.state.persons.map((person) => person)}
          </div>
        </div>
        <h3>
            الحياة مغامرة لكل شخص. إنها رحلة رائعة تجعلنا نتعلم طوال حياتنا.
            الناس يشيخون ويموتون في مجرى حياتهم. لديهم تجارب مختلفة بناءً على
            عدد السنوات التي يعيشونها. تساعدك حاسبة العمر على تقدير عمرك بناءً
            على عدد السنوات التي عشتها.{" "}
            {" "}
            لحساب عمر شخص ما ، يستخدم الناس أولاً آلة حاسبة للعمر. تُستخدم
            الآلات الحاسبة للعمر لتقدير العمر وأيضًا لتحديد متوسط ​​عمر مجموعة
            معينة من الأشخاص. على سبيل المثال ، يمكن استخدام آلة حاسبة للعمر
            لتقدير عمر مجموعة من أطفال المدارس أو لحساب متوسط ​​عمر مجموعة من
            الموظفين. بالإضافة إلى ذلك ، يعد استخدام حاسبة العمر مفيدًا عند حساب
            عمر شخص ما في الأماكن العامة أو عند التفاعل مع هذا الشخص. على سبيل
            المثال ، إذا سأل أحدهم عمرك ولم تكن مرتاحًا للإجابة ، فيمكنك تقدير
            عمره وتأكيد إجابتك من خلال مقارنته بتقديرك. بالإضافة إلى ذلك ، يعد
            استخدام الآلة الحاسبة للعمر مفيدًا عند التفاعل مع كبار السن لأنه
            يُظهر احترامك لأعمارهم وخبراتهم من خلال تزويدك بأعمارهم الدقيقة. - -
            فيما يلي بعض الأمثلة عن كيفية استخدام حاسبة العمر: *** ** يعد
            استخدام حاسبة العمر فكرة جيدة لأنها تساعدك على تقدير عمر شخص ما
            وإظهار احترامك لذلك الشخص من خلال تقديم عمره بالضبط. الرقم 84321
            يمثل تعبير "العمر" باللغة العربية. كما ذكرنا سابقًا ، يتم استخدام
            آلة حاسبة للعمر لتقريب عمر الفرد وأيضًا لتحديد متوسط ​​عمر مجموعة من
            الأشخاص. بالإضافة إلى ذلك ، يعد استخدام حاسبة العمر مفيدًا عند حساب
            عمر شخص ما في الأماكن العامة أو عند التفاعل مع هذا الشخص. فمثلا:
        </h3>
      </div>
      </>
    );
  }
}
