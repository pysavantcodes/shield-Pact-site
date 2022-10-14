import { divIcon } from "leaflet";
import React from "react";

const CreateTokenModal = ({removeModal}) => {
  return (
    <div className="modal-bg">
      <p onClick={removeModal} id="cancel">
        +
      </p>
      <div className="token-modal">
        <h3>Create Token</h3>
        <label htmlFor="type">Token Type
        <select name="type">
            <option value="Standard Token">Standard Token</option>
            <option value="Standard Token">Standard Token</option>
        </select>
        </label>
        <label htmlFor="name">Name
        <input name="name" type="text" placeholder="Ex: Ethereum" />
        </label>
        <label htmlFor="symbol">Symbol
        <input name="symbol" type="text" placeholder="Ex: ETH" />
        </label>
        <label htmlFor="decimals">Decimals
        <input name="decimals" type="number" placeholder="Ex: 18" />
        </label>
        <label htmlFor="supply">Total supply
        <input name="supply" type="number" placeholder="Ex: 10000000000" />
        </label>
        <label htmlFor="check"><input name="check" id="check" type="checkbox" />Implement Pink Anti-Bot System?
        
        </label>
        <button className="btn">Create Token</button>
      </div>
    </div>
  );
};

export default CreateTokenModal;
