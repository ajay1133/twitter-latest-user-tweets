import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const GetTweets = () => {
  const { apiOrigin = "http://localhost:3001", audience } = getConfig();
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
    loading: false
  });
  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();
  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
    await callApi();
  };
  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
    await callApi();
  };
  const callApi = async () => {
    try {
      setState({
        ...state,
        loading: true,
        showResult: false,
        apiMessage: "",
      });
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiOrigin}/api/process-tweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      setState({
        ...state,
        loading: false,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        apiMessage: error && typeof error === 'string'
          ? error
          : (
            error.error && typeof error.error === 'string'
              ? error.error : 'Something went wrong'
          ),
      });
    }
  };
  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };
  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}
        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}
        <h1>Get Tweets</h1>
        <p className="lead">
          Search Twitter For User Mentions
        </p>
        <p>
          Returns a collection of the most recent Tweets and Retweets posted by the
          authenticating user and the users they follow.
          The home timeline is central to how most users interact with the Twitter service.
          It is more volatile for users that follow many users or follow users who Tweet frequently
        </p>
        <Button
          color="primary"
          className="mt-5"
          onClick={callApi}
          disabled={!audience}
        >
          Get Tweets
        </Button>
      </div>
      <div className="result-block-container">
        {state.loading && <Loading hideSpinner="true" className="center" />}
        {!state.loading && state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuthenticationRequired(GetTweets, {
  onRedirecting: () => <Loading />,
});
