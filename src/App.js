
import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { HalfMalf } from 'react-spinner-animated';

import 'react-spinner-animated/dist/index.css'
import surveyData from './components/surveyData';


function App() {
  const [input, setInput] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [product, setProduct] = useState("");
  const [completedSentence, setCompletedSentence] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [rangeValue, setRangeValue] = useState(0);
  const [loading, setLoading] = useState(false)
  const [API_Key, setAPI_Key] = useState("<YOUR OPENAI SECRET KEY>");
  const [activePage, setActivePage] = useState("home");
  const [occupation, setOccupation] = useState("");


  const isActive = (key) => (activePage === key ? 'active' : '');


  const fetchData = async () => {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: generatePrompt(),
        model: "text-davinci-003",
        temperature: 0.5,
        max_tokens: 150,
        n: 1
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_Key}`,
        },
      }
    );
    console.log(response)
    return response.data.choices[0].text;
  };

  const generatePrompt = () => {
    return product !== "" && targetGroup !== "" && input !== "" ?
      `Make a product description for marketing, which is supposed to increase sales for Amazon having the category of "${category}", for the product "${product}" given the target customer group of "${targetGroup}" with the specifications of "${input}", in addition the subcategory of the product is "${subcategory}". Please make it minimum of ${rangeValue} words` : null
  }

  async function handleClick() {
    try {
      setLoading(true)
      const completedSentence = await fetchData(input);
      setLoading(false)
      setCompletedSentence(completedSentence);
      setAPI_Key("<YOUR OPENAI SECRET KEY>")
    } catch (error) {
      console.error(error);
    }
  }

  return (

    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${isActive('home') ? "active" : ""}`}>
              <p className="nav-link" to="" onClick={() => setActivePage("home")}>Home</p>
            </li>
          </ul>

          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${isActive('survey') ? "active" : ""}`}>
              <p className="nav-link" to="" onClick={() => setActivePage("survey")}>Start a survey</p>
            </li>
          </ul>

        </div>
      </nav>
      <>
        {activePage === 'home' ? (
          <div className='float-container rowD'>
            <div className='float-child'>
              <Form className='main-form'>
                <h2>Generate a product description</h2>
                <h3>Filters:</h3>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="ControlInput1">
                      <Form.Label>Target Group: </Form.Label>
                      <Form.Control
                        type='text'
                        value={targetGroup}
                        placeholder="Target group"
                        onChange={changeEvent => setTargetGroup(changeEvent.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="ControlInput4">
                      <Form.Label>Category: </Form.Label>
                      <Form.Control
                        type='text'
                        value={category}
                        placeholder="Product category"
                        onChange={changeEvent => setCategory(changeEvent.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="ControlInput2">
                      <Form.Label>Product Type :</Form.Label>
                      <Form.Control
                        type='text'
                        value={product}
                        placeholder="Please specify the product"
                        onChange={changeEvent => setProduct(changeEvent.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="ControlInput5">
                      <Form.Label>Subcategory: </Form.Label>
                      <Form.Control
                        type='text'
                        value={subcategory}
                        placeholder="Product subcategory"
                        onChange={changeEvent => setSubcategory(changeEvent.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="ControlInput3">
                  <Form.Label>Max. number of words:</Form.Label>
                  <RangeSlider
                    value={rangeValue}
                    onChange={changeEvent => setRangeValue(changeEvent.target.value)}
                    min={10}
                    max={100}
                    step={10}
                    size='sm'
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="ControlTextarea1">
                  <Form.Label>More details on the product</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Please give more details about the specified product..."
                    onChange={(event) => setInput(event.target.value)}
                  />
                </Form.Group>
              </Form>
              <button
                className="btn btn-primary"
                onClick={handleClick}
                type="submit">
                Generate GPT Answer</button>
            </div>
            <div className='float-child'>
              {
                loading ? (
                  <HalfMalf text={"Loading..."} center={false} width={"150px"} height={"150px"} bgColor={"#F0A500"} />
                ) : (
                  completedSentence &&
                  <Card border="primary" style={{ width: '40rem' }} className="mb-2">
                    <Card.Header>ChatGPT Response</Card.Header>
                    <Card.Body>
                      <Card.Title>Generated Product Description:</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Product Type: {product.toUpperCase()}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 text-muted">Target Group: {targetGroup.toUpperCase()}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 text-muted">Category: {category.toUpperCase()}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 text-muted">Subcategory: {subcategory.toUpperCase()}</Card.Subtitle>
                      <Card.Subtitle className="mb-2 text-muted">Max. number of words: {rangeValue}</Card.Subtitle><br></br>
                      <Card.Text>
                        {completedSentence}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )
              }

            </div>
          </div>
        ) : (
          <div className='float-child'>
            <Form className='main-form'>
              <h2>Questionnaire for Consumer Perception on AI generated content</h2>
              <h3>Gatekeeper questions:</h3><br></br>
              <Row>
                <Form.Group>
                  <Form.Label>Are you a frequent online shopper?</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Row><br></br>
              <Row>
                <Form.Group>
                  <Form.Label>Do you check product descriptions before buying online?</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Row><br></br>
              <h3>Demographical questions:</h3><br></br>
              <Row>
                <Form.Group>
                  <Form.Label>How old are you?</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>Select...</option>
                    <option value="1">18-29</option>
                    <option value="2">30-39</option>
                    <option value="3">40-49</option>
                    <option value="4">50-59</option>
                    <option value="5">60-69</option>
                    <option value="6">70+</option>
                  </Form.Select>
                </Form.Group>
              </Row><br></br>
              <Row>
                <Form.Group>
                  <Form.Label>What is your highest level of education?</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>Select...</option>
                    <option value="1">Elementary school</option>
                    <option value="2">High school</option>
                    <option value="3">University, Bachelor</option>
                    <option value="4">University, Master and above</option>
                    <option value="5">High vocational education</option>
                  </Form.Select>
                </Form.Group>
              </Row><br></br>
              <Row>
                <Form.Group className="mb-3" controlId="ControlInput5">
                  <Form.Label>What is your current employment?</Form.Label>
                  <Form.Control
                    type='text'
                    value={occupation}
                    placeholder="Occupation"
                    onChange={changeEvent => setOccupation(changeEvent.target.value)}
                  />
                </Form.Group>
              </Row><br></br>
              <h3>Comparative Questions:</h3>
              <Row>
                <ul>
                  {surveyData.map((item, index) => (
                    <Row>
                      <h3>Product {index + 1} - {item["ProductA"]["product"]}</h3><br></br>
                      <Col>
                        <Card border="primary" style={{ width: '40rem', color: "red" }} className="col align-self-center">
                          <Card.Header>Option 1</Card.Header>
                          <Card.Body>
                            <Card.Title>Product Description:</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Product Type: {item["ProductA"]["product"]}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Target Group: {item["ProductA"]["targetGroup"]}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Category: {item["ProductA"]["category"]}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Subcategory: {item["ProductA"]["subcategory"]}</Card.Subtitle><br></br>
                            <Card.Text>
                              {item["ProductA"]["productDescription"]}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col>
                        <Card border="primary" style={{ width: '40rem', color: "green" }} className="col align-self-center">
                          <Card.Header>Option 2</Card.Header>
                          <Card.Body>
                            <Card.Title>Product Description:</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Product Type: {item["ProductB"]["product"]}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Target Group: {item["ProductB"]["targetGroup"]}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Category: {item["ProductB"]["category"]}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Subcategory: {item["ProductB"]["subcategory"]}</Card.Subtitle><br></br>
                            <Card.Text>
                              {item["ProductB"]["productDescription"]}
                            </Card.Text>
                          </Card.Body>
                        </Card><br></br>
                      </Col>
                      <Form.Group className="mb-3" controlId="ControlInput13">
                        <Form.Label>Please rate the descriptions in terms of marketing content (1-10): </Form.Label>
                        <RangeSlider
                          value={rangeValue}
                          onChange={changeEvent => setRangeValue(changeEvent.target.value)}
                          min={10}
                          max={100}
                          step={10}
                          size='sm'
                        /><br></br>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Which product description, Option 1 or Option 2, do you think generated by the AI?</Form.Label>
                        <Form.Select aria-label="Default select example">
                          <option>Select...</option>
                          <option value="Option1">Option 1</option>
                          <option value="Option2">Option 2</option>
                        </Form.Select><br></br>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Which product, A or B, would you buy?</Form.Label>
                        <Form.Select aria-label="Default select example">
                          <option>Select...</option>
                          <option value="Option1">Option 1</option>
                          <option value="Option2">Option 2</option>
                        </Form.Select><br></br>
                      </Form.Group>
                    </Row>
                  ))}
                </ul>
              </Row>
            </Form>
          </div>
        )
        }
      </>

    </div>

  );

}




export default App;


