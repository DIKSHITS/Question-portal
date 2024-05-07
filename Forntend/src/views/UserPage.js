import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function User() {
  const email = sessionStorage.getItem("email");
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    phone: ''
  });
  const [editing, setEditing] = useState(false); // State to manage edit mode

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3002/Profile', { params: { email } });
        setUserList(response.data);
        setFormData({
          username: response.data.name,
          phone: response.data.phoneNumber
        });
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error(error);
        setError("Error fetching data");
      }
    }

    fetchData();
  }, [email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = () => {
    setEditing(true); // Enable edit mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/update-profile', {
        email,
        username: formData.username,
        phone: formData.phone
      });
      console.log("Profile updated successfully:", response.data);
      setEditing(false); // Disable edit mode after saving changes
    } catch (error) {
      console.error("Error updating profile:", error);
      // You can display an error message or handle errors as needed
    }
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardBody>
                <Row>
                  <Col className="pr-1" md="6">
                    <h5 className="title">User Profile</h5>
                    {error && <div>Error: {error}</div>}
                    {userList.map((userData, index) => (
                      <div key={index}>
                        <Table>
                          <tbody>
                            <tr>
                              <td>Name:</td>
                              <td>{userData.username}</td>
                            </tr>
                            <tr>
                              <td>Email:</td>
                              <td>{userData.email}</td>
                            </tr>
                            <tr>
                              <td>Phone:</td>
                              <td>{userData.phoneNumber}</td>
                            </tr>
                            <tr>
                              <td>Category:</td>
                              <td>{userData.category}</td>
                            </tr>
                          </tbody>
                        </Table>
                        {!editing ? (
                          <Button color="primary" onClick={handleEditClick}>Edit Profile</Button>
                        ) : (
                          <Form onSubmit={handleSubmit}>
                            <FormGroup>
                              <Label for="username">Name</Label>
                              <Input type="text" name="username" id="username" placeholder="Enter your Name" value={formData.username} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                              <Label for="phone">Phone</Label>
                              <Input type="text" name="phone" id="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
                            </FormGroup>
                            <div>
                              <Button color="primary" type="submit">Save Changes</Button>
                              <Button color="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                            </div>
                          </Form>
                        )}
                      </div>
                    ))}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
