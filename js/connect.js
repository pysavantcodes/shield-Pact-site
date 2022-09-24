window.onload = async() => {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Clitecoin%2Cethereum%2Cdogecoin%2Cbusd%2Cbnbc&vs_currencies=usd")
    const data = await response.json()
    console.log(data);

    document.querySelector(".btc .text-right p").textContent = `$${data.bitcoin.usd}`;
    document.querySelector(".eth .text-right p").textContent = `$${data.ethereum.usd}`;
    document.querySelector(".busd .text-right p").textContent = `$${data.busd.usd}`;
    document.querySelector(".bnb .text-right p").textContent = `$${data.bnbc.usd}`;
}


function connectWallet(event) {
    ethereum.request({ method: "eth_requestAccounts" }).then(accounts => {
        let account;
        account = accounts[0];
        // localStorage.setItem("walletConnected", "true");
        document.querySelector(".right p").style.display = "none";
        document.querySelector(".--card-header-left").style.display = "none";
        document.querySelector(".right button").style.fontSize = "10px";
        document.querySelector(".right button").style.width = "100px"
        document.querySelector(".right button").textContent = `Connected: ${account}`;
        document.querySelector(".right button").disabled = true;
        document.querySelector(".connect-wallet-modal-bg").style.display = "none";


        // localStorage.setItem("walletAddress", account);

        ethereum.request({ method: "eth_getBalance", params: [account, 'latest'] }).then(result => {
            let wei = parseInt(result, 16);
            let balance = wei / (10 ** 18);
            console.log(balance)
        });
    });


}


// window.onload = () => {
//     if (localStorage.getItem("walletConnected") === "true") {
//         document.querySelector(".right p").textContent = localStorage.getItem("walletAddress");
//         document.querySelector(".right button").style.display = "none";
//     }
// }