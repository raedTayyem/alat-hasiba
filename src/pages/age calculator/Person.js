import React, { Component } from "react";

export default class Person extends Component {
  constructor(state, props) {
    super(state, props);
    this.state = {};
    this.init();
  }

  componentDidMount() {
    var birthdayTime = Date.parse(
      `${this.props.birthDate} ${this.props.birthTime}`
    );
    var date = new Date(birthdayTime);
    var birthday = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    this.setState({
      birthdayTime,
      birthday,
    });
  }

  toString() {
    return this.props.name;
  }

  render() {
    return (
      <div className="person">
        <div>
          <p>{this.props.name}</p>
          <p> (*️{this.state.birthday}) </p>
        </div>
        <div>
          <p>لديه</p>
          <p>{this.state.age} </p>
          <p>{this.props.getUnitLabel()} من العمر.</p>
        </div>
          <button className="remove" onClick={this.props.remove}>
            <span role="img" aria-labelledby="Remove">
              ➖
            </span>
          </button>
      </div>
    );
  }

  init() {
    setInterval(() => {
      var now = new Date().getTime();

      var age = Number(
        Math.floor((now - this.state.birthdayTime) / this.props.getFactor())
      ).toLocaleString();

      this.setState({ age });
    }, 1);
  }
}
