import React from "react";
import axios from "axios";
import styled from 'styled-components';
import Search from "./customer/search.jsx";
import Orders from "./customer/orders.jsx";
import Menu from "./customer/menu.jsx";
import Checkout from "./customer/checkout.jsx";
import Modal from "./customer/modal.jsx";
import Tipping from "./customer/Tipping.jsx"



//Styled Components
const Wrapper = styled.div`
  max-width: 480px;
`;

class App extends React.Component {
  state = {
    menu: {},
    orders: [],
    checkout: {
      CustomerId: "",
      status: "pending",
      drinkOrder: [],
      total: 0,
    },
    search: "",
    modal: "",
    showOrders: false
  };

  componentDidMount() {
    this.getMenu();
    this.getCustomerOrders();
    // this.interval = setInterval(() => {
    //   this.getCustomerOrders();
    // }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  // called when adding drink(s) to your order for checkout
  checkOutUpdate = order => {
    let drinks = this.state.checkout.drinkOrder;
    // console.log('drinks', drinks);
    // console.log('order', order);
    let drinksExistsinCheckOut = false;
    for (var i = 0; i < drinks.length; i++) {
      if (drinks[i].menuItemId === order.menuItemId) {
        drinksExistsinCheckOut = true;
        drinks[i].quantity += order.quantity;
        drinks[i].subtotal += order.subtotal;
      }
    }
    if (!drinksExistsinCheckOut) {
      drinks.push(order);
      this.setState({
        checkout: Object.assign({}, this.state.checkout, { drinkOrder: drinks, total: order.subtotal })
      });
    }
  };

  // handle live search
  handleSearchOnKeyUp = e => {
    if (e.key !== "Enter") {
      this.setState({
        search: e.target.value
      });
    }
  };

  // retreive business menu from db
  getMenu() {
    axios.get(`/api/menu/categories`).then(response => {
      this.setState({
        menu: response.data
      });
    });
  }

  // retrieve customer orders from db
  getCustomerOrders() {
    let customerID = 1;
    axios
      .get(`/api/customers/${customerID}/orders`)
      .then(response => {
        //console.log(response.data);
        this.setState({
          orders: response.data
        });
        setTimeout(this.getCustomerOrders(), 2000);
      });
  }

  // change modal status to show or not (for checkout)
  changeModal(view) {
    this.setState({
      modal: view,
    });
  }

  changeModalUpdateTotal(view, wTipTotal) {
    console.log('with tip', wTipTotal)
    this.setState({
      checkout: Object.assign({}, this.state.checkout, { total: wTipTotal }),
      modal: view,
    });
    console.log('state total', this.state.checkout.total)
  }

  
  // show the status of the customer orders
  toggleOrderView() {
    this.setState(prevState => ({
      showOrders: !prevState.showOrders
    }));
  }

  emptyCart() {
    this.setState({
      checkout: {
        CustomerId: "",
        status: "pending",
        drinkOrder: [],
        total: 0,
      }
    });
  }

  renderModal() {
    if (this.state.modal === "checkout") {
      return (
        <Modal>
          <Checkout
            emptyCart={this.emptyCart.bind(this)}
            checkout={this.state.checkout}
            changeModal={this.changeModal.bind(this)}
            getOrders={this.getCustomerOrders.bind(this)}
          />
        </Modal>
      );
    }
    if (this.state.modal === "tipping") {
      return (
        <Modal>
          <Tipping 
            checkout={this.state.checkout} 
            updateTotal={this.changeModalUpdateTotal.bind(this)}
            changeModal={this.changeModal.bind(this)}
            
            />
        </Modal> 
      )
    }
  }

  render() {
    return (

      <Wrapper>
        {/* <h1>Title</h1> */}
        <div id="test" />
        <nav>
          <Search handleSearch={this.handleSearchOnKeyUp} />{" "}
          <button onClick={() => this.changeModal("checkout")}>Checkout</button>{" "}
          <button onClick={() => this.toggleOrderView()}>My Orders</button>
        </nav>
        {this.state.showOrders === true ? (
          <Orders currentOrders={this.state.orders} />
        ) : null}
        <Menu
          menuItems={this.state.menu}
          checkOutUpdate={this.checkOutUpdate}
          search={this.state.search.toLowerCase()}
        />
        <div>{this.renderModal()}</div>
      </Wrapper>
    );
  }
}

export default App;
