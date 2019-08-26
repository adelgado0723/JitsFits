import React, { Component } from "react";
import Header from "../components/Header";
import Meta from "../components/Meta";

class Page extends Component {
  render() {
    return (
      <div>
        {/* <p>Hey, I'm the page component</p> */}
        <Meta />
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default Page;
