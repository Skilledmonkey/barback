import React from "react";
import styled from "styled-components";
import axios from "axios";

const ModalContainer = styled.div`
  background-color: white;
  width: 350px;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
`;

const ClickableWrapper = styled.button`
  margin: 3px;
  width: 30%;
  font-size: 0.8em;
`;

class EditMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedItemName: '',
      updatedPrice: '',
      updatedDescription: '',
      updatedImageUrl: '',
    };
  }
  componentDidMount() {

  }
  handleItemNameInput(event) {
    this.setState({updatedItemName: event.target.value});
  }

  handlePriceInput(event) {
    this.setState({updatedPrice: event.target.value});
  }

  handleDescriptionInput(event) {
    this.setState({updatedDescription: event.target.value});
  }

  handleImageUrlInput(event) {
    this.setState({updatedImageUrl: event.target.value});
  }

  handleSubmit() {
    // axios post request to update item to database
    this.props.toggleModal();
  }

  render() {
    const item = this.props.menuItem;
    return (
      <ModalContainer>
        <div>
          <form>
            <h2>Edit Menu Item</h2>
            Item Name<br />
            <input 
              type="text"
              name="item-name"
              defaultValue={item.itemName}
              onChange={this.handleItemNameInput.bind(this)} />
            <br /><br />
            Price<br />
            <input 
              type="text"
              name="price"
              defaultValue={item.price}
              onChange={this.handlePriceInput.bind(this)} />
            <br /><br />
            Description<br />
            <textarea 
              rows="4"
              cols="100%"
              name="description"
              defaultValue={item.description}
              onChange={this.handleDescriptionInput.bind(this)} />
            <br /><br />
            Image URL<br />
            <input 
              type="text"
              name="image-url"
              defaultValue={item.imageUrl}
              onChange={this.handleImageUrlInput.bind(this)} />
            <br /><br />
            <ClickableWrapper type="submit" onClick={this.handleSubmit.bind(this)}>
              Save Item
            </ClickableWrapper>
          </form>
          <ClickableWrapper onClick={() => this.props.toggleModal()}>
            Exit
          </ClickableWrapper>
        </div>
      </ModalContainer>
    );
  }
}

export default EditMenuItem;