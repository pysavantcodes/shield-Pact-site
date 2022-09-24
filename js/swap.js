function connectWallet(event) {
    ethereum.request({ method: "eth_requestAccounts" }).then(accounts => {
        let account;
        account = accounts[0];
        // localStorage.setItem("walletConnected", "true");
        document.querySelector(".right p").style.display = "none";

        document.querySelector(".right button").style.fontSize = "10px";
        document.querySelector(".right button").style.width = "100px"
        document.querySelector(".right button").textContent = `Connected: ${account}`;
        document.querySelector(".right button").disabled = true;
        document.querySelector(".connect-wallet-modal-bg").style.display = "none";
        document.getElementById("swap").textContent = "Swap";


        // localStorage.setItem("walletAddress", account);

        ethereum.request({ method: "eth_getBalance", params: [account, 'latest'] }).then(result => {
            let wei = parseInt(result, 16);
            let balance = wei / (10 ** 18);
            console.log(balance)
        });
    });


}