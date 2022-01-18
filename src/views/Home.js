import React, { Fragment, useState } from "react";
import { Input, InputGroup } from "reactstrap";
import Highlight from "../components/Highlight";
import Hero from "../components/Hero";
import { getConfig } from "../config";
import Loading from "../components/Loading";

const Home = () => {
  const { apiOrigin = "http://localhost:3001" } = getConfig();
  const [state, setState] = useState({
    loading: false,
    showResult: false,
    apiMessage: "",
    error: null,
    timeout: null
  });
  const callApi = async (deBounce = false) => {
    if (deBounce) {
      if (state.timeout) {
        clearTimeout(state.timeout);
      }
    }
    setState({
      timeout: setTimeout(searchTweets, 500)
    });
  };
  const searchTweets = async () => {
    const search = document.getElementById('searchTweetText').value;
    if (!search) {
      setState({
        loading: false,
        timeout: null,
        showResult: false
      });
      return;
    }
    try {
      setState({
        ...state,
        loading: true,
        timeout: null
      });
      const response = await fetch(`${apiOrigin}/api/search-tweets?search=${search}`);
      const responseData = await response.json();
      setState({
        ...state,
        loading: false,
        showResult: true,
        apiMessage: responseData && Array.isArray(responseData.data) && responseData.data.length
          ? responseData.data : 'No results found',
      });
    } catch (error) {
      setState({
        ...state,
        apiMessage: error && typeof error === 'string'
          ? error
          : (
            error.error && typeof error.error === 'string'
              ? error.error : 'Something went wrong'
          ),
      });
    }
  }
  return (
    <Fragment>
      <Hero />
      <div className="result-block-container result-block-container-main">
        <InputGroup>
          <Input
            id="searchTweetText"
            placeholder="Search tweets by text ..."
            onChange={() => callApi(true)}
          />
        </InputGroup>
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
    </Fragment>
  );
};

export default Home;
