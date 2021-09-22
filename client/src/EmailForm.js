import React from "react";
import './style/Alert.css';
import {submitEmail} from './HttpClient';
import './style/DisplayCanvas.css';
import './style/Home.css';
import './style/EmailForm.css';

class EmailForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {email: '', imageDisplayed: false, hex: '', successStatus: ''};
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.emailForm = this.emailForm.bind(this);
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Submitting email: " + this.state.email);
    submitEmail(this.state.email, this, function(parent, res) {
        console.log(res)
        if (res.ok) {
            parent.setState({successStatus: '200'});
        } else {
            parent.setState({successStatus: 'Error'});
        }
    })
  }

  getHttpStatus() {
      if (!this.state.successStatus) {
          return;
      } else if (this.state.successStatus === 'Error') {
        return <div>Error while saveing email.  Please try again.</div>;
      } else {
          //   this.setState({successStatus: false});
          return <div>Email submitted successfully! Please check your email to verify.</div>;
      }
  }

  emailForm = () => {
    let result = <div className="container column middle">
        <h4 id="center">Be the first to hear about our upcoming Mainnet launch.</h4>
        <div id="center">Join our email list below.</div>
      <form onSubmit={(event) => this.handleSubmit(event)}>
          <input
            name="email"
            type="email"
            required
            placeholder="Email:"
            value={this.state.email}
            onChange={(event) => this.handleChangeEmail(event)} />
        <br />
        <input type="submit" value="Subscribe" />
      </form>
      <div>{this.getHttpStatus()}</div>
    </div>;
    return result;
  }

  render() {
    return (
        <div className="home content emailForm">
            <div className="row">
                <div className="column left">
                </div>
                {this.emailForm()}
                <div className="column right">
                </div>
            </div>
        </div>
    );
  }
}

export default EmailForm;