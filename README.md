# chainx-wallet-dapps

## Architecture

![image](https://github.com/chainx-org/chainx-wallet-dapps/tree/feature/document/images/architecture.png)

- Start Signer App in the computer, select account and node. It will start a small websocket server and expose the port when the Signer App initialize itself.
- Then the Dapp Browser Wallet will initialize the Signaler-Connector, connects to the signer service, and gets the connection status.

- After that, The Dapp Browser Wallet can start any transaction、signs and get account information such as balance、nonce and the other things by the Signner-Connector.
- The request closes and the transaction is completed.

## install

yarn install

## run

- cd packages/wallet
- yarn run start
