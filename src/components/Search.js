import React, { useState, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import JobsContext from "../context/jobs";

const Search = () => {
  const { onSearch } = useContext(JobsContext);

  const [state, setState] = useState({
    description: "",
    location: "",
    full_time: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "full_time") {
      setState((prevState) => ({ ...state, [name]: !prevState.full_time }));
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(state);
    onSearch(state);
  };

  return (
    <div className="search-section">
      <Form className="search-form" onSubmit={handleSearch}>
        <Row>
          <Col md={{ span: 3, offset: 3 }}>
            <Form.Group controlId="description">
              <Form.Control
                className="search-box"
                type="text"
                name="description"
                value={state.description || ""}
                placeholder="Position you are applying for"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={{ span: 3 }}>
            <Form.Group controlId="location">
              <Form.Control
                className="search-box"
                type="text"
                name="location"
                value={state.location || ""}
                placeholder="Location of your choice"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="checkbox-option justify-content-md-center">
          <Col xs lg="2"></Col>
          <Col md="auto">
            <div className="filters">
              <Form.Group controlId="full_time">
                <Form.Check
                  type="checkbox"
                  name="full_time"
                  className="full-time-checkbox"
                  label="Full time only"
                  checked={state.full_time}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
          </Col>
          <Col xs lg="2"></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs lg="2"></Col>
          <Col md="auto">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="btn-search"
            >
              Search
            </Button>
          </Col>
          <Col xs lg="2"></Col>
        </Row>
      </Form>
    </div>
  );
};
export default Search;
