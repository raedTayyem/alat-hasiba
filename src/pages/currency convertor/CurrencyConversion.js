import React from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "./CurrencyConversion.scss";

class CurrencyConversion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount1: 1,
      amount2: 0,
      height: "",
      weight: "",
      rates: {},
      from: "USD",
      to: "EUR"
    };
    this.convertCurrency = this.convertCurrency.bind(this);
  }

  // componentDidMount() {
  //   fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`)
  //     .then(res => res.json())
  //     .then(json => this.setState({ data: json }));
  // }

  // componentDidMount() {
  //   debugger;
  //   axios
  //     .get(
  //       `https://api.exchangeratesapi.io/latest?access_key="T7nKfWqqYTSJgAzMzekYNBS7bFMSkN2C"`
  //     )
  //     .then((response) => {
  //       console.log("response", response);
  //       this.setState({ rates: response.data.rates });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  convertCurrency() {
    var from = this.state.from
    var to = this.state.to
    debugger
    var myHeaders = new Headers();
    myHeaders.append("apikey", "T7nKfWqqYTSJgAzMzekYNBS7bFMSkN2C");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${this.state.amount1}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        this.setState({ amount2: result.result });
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <>
        <Helmet>
          <title>Shop</title>
          <meta name="description" content="Shop our latest products now." />
          <link rel="canonical" href="/shop" />
        </Helmet>
        <div>
          <h1>تحويل عملات</h1>
          <input
            onChange={(e) => this.setState({ amount1: e.target.value })}
          ></input>
          <button onClick={this.convertCurrency}>submit</button>
          {this.state.amount2}
        </div>
      </>
    );
  }
}

export default CurrencyConversion;
