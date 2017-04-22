import React from 'react';
import Input from "react-toolbox/lib/input";
import Button from "react-toolbox/lib/button";
import { Card, Icon } from "../../components/UI";
import styles from "../netlify-auth/AuthenticationPage.css";

export default class AuthenticationPage extends React.Component {
  static propTypes = {
    onLogin: React.PropTypes.func.isRequired,
  };

  state = { 
    email: '',
    password: '',
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.props.onLogin(this.state);
  };

  handleEmailChange = (value) => {
    this.setState({ email: value });
  };

  handlePasswordChange = (value) => {
    this.setState({ password: value });
  };

  render() {
    return (<section className={styles.root}>
      <Card className={styles.card}>
        <Input
          type="text"
          label="Email"
          name="email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />

        <Input
          type="password"
          label="Password"
          name="password"
          value={this.state.Password}
          onChange={this.handlePasswordChange}
        />

        <Button
          className={styles.button}
          raised
          onClick={this.handleLogin}
        >
          <Icon type="login" /> Login
        </Button>
      </Card>
    </section>);
  }
}
