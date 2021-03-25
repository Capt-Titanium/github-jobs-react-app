import React, { useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { initiateGetJobs } from "../actions/jobs";
import { resetErrors } from "../actions/errors";
import Header from "./Header";
import Search from "./Search";
import Results from "./Results";
import JobDetails from "./JobDetails";
import JobsContext from "../context/jobs";
import Loader from "./Loader";
import { Button, Col, Row } from "react-bootstrap";
import load from "../images/load.gif";

const HomePage = (props) => {
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState(-1);
  const [page, setPage] = useState("home");
  const [pageNumber, setPageNummber] = useState(1);
  const [selection, setSelection] = useState(null);
  const [hideLoadMore, setHideLoadMore] = useState(false);

  useEffect(() => {
    setResults(props.jobs);
  }, [props.jobs]);

  useEffect(() => {
    setErrors(props.errors);
  }, [props.errors]);

  const loadJobs = (selection) => {
    const { dispatch } = props;
    const { description, location, full_time, page = 1 } = selection;
    let isLoadMore = false;
    if (selection.hasOwnProperty("page")) {
      isLoadMore = true;
    }
    dispatch(resetErrors());
    setIsLoading(true);
    dispatch(
      initiateGetJobs({ description, location, full_time, page }, isLoadMore)
    )
      .then((response) => {
        if (response && response.jobs.length === 0) {
          setHideLoadMore(true);
        } else {
          setHideLoadMore(false);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleSearch = (selection) => {
    loadJobs(selection);
    setSelection(selection);
  };

  const handleItemClick = (jobId) => {
    setPage("details");
    console.log("item clicked");
    setJobId(jobId);
  };

  const handleResetPage = () => {
    setPage("home");
  };

  const handleLoadMore = () => {
    loadJobs({ ...selection, page: pageNumber + 1 });
    setPageNummber(pageNumber + 1);
  };

  let jobDetails = {};
  if (page === "details") {
    console.log("page is details");
    jobDetails = results.find((job) => job.id === jobId);
  }

  const value = {
    results,
    details: jobDetails,
    onSearch: handleSearch,
    onItemClick: handleItemClick,
    onResetPage: handleResetPage,
  };

  return (
    <JobsContext.Provider value={value}>
      <Loader show={isLoading}>
        <Row>
          <Col>
            <img className="loading-gif" src={load} alt="" />
          </Col>
        </Row>
      </Loader>
      <div className={`${page === "details" && "hide"}`}>
        <div className="heading-section">
          <Header /> <Search onSearch={handleSearch} />
        </div>
        {!_.isEmpty(errors) && (
          <div className="errorMsg">
            <p>{errors.error}</p>
          </div>
        )}
        <div className="results-section">
          <Results results={results} onItemClick={handleItemClick} />
        </div>
        {results.length > 0 && _.isEmpty(errors) && !hideLoadMore && (
          <div
            className="load-more"
            onClick={isLoading ? null : handleLoadMore}
          >
            <Button
              disabled={isLoading}
              className={`${isLoading ? "disabled" : ""}`}
              variant="outline-info"
              size="lg"
            >
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
      <div className={`${page === "home" && "hide"}`}>
        {page === "details" && (
          <JobDetails details={jobDetails} onResetPage={handleResetPage} />
        )}
      </div>
    </JobsContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  jobs: state.jobs,
  errors: state.errors,
});

export default connect(mapStateToProps)(HomePage);
