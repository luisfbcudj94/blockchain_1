import React, { Component } from "react";
import EscribirEnLaBlockchain from "./contracts/EscribirEnLaBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    ValorActual: '',
    nuevoValor: '',
    web3: null, 
    accounts: null, 
    contract: null 
  };

  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EscribirEnLaBlockchain.networks[networkId];
      const instance = new web3.eth.Contract(
        EscribirEnLaBlockchain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      
      const response = await this.state.contract.methods.Leer().call();
      this.setState({
        ValorActual : response
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  storeValue = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;

    try{
      // Stores a given value, 5 by default.
      await contract.methods.Escribir(this.state.nuevoValor).send({ from: accounts[0] });

      const response = await this.state.contract.methods.Leer().call();

      this.setState({
        ValorActual : response
      });
    }catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
    }

    
  };


  handleChangeValue = (event) =>{
    this.setState({
      nuevoValor: event.target.value
    })
  }


  render() {
    
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    return (
      <div className="App">
        <h1>
          INGRESAR DATOS A LA BLOCKCHAIN
        </h1>
        <div className="container">
          <p>El valor actual del contrato es: </p>
          <p id="valor">{this.state.ValorActual}</p>
          <form onSubmit={this.storeValue}>
            <label>Nuevo valor a almacenar en la blockchain: </label>
            <input type="text" value={this.state.nuevoValor} onChange={this.handleChangeValue}></input>
            <br></br>
            <input type="submit" value="Almacenar Valor"></input>
          </form>
        </div>
        
      </div>
    );
  }
}

export default App;
