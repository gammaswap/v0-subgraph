# V1-Subgraph

Using The Graph to index a user’s borrowed and lent positions. This requires setting up a hardhat node against a local graph node to query all GammaSwap contract events by user.

## Table of Contents

- [Deploy smart contracts in hardhat](https://github.com/gammaswap/v1-subgraph/edit/subgraph-base/README.md#10-smart-contracts---00008545)
- [Run the graph node locally](https://github.com/gammaswap/v1-subgraph/edit/subgraph-base/README.md#20-graph-node---localhost8020)
- [Create and deploy subgraphs to the graph node](https://github.com/gammaswap/v1-subgraph/edit/subgraph-base/README.md#30-v1-subgraph---1270018000)

## 1.0 Smart Contracts - 0.0.0.0:8545

This is to deploy smart contracts on a local environment with Hardhat. There is very little documentation integrating Hardhat with The Graph’s graph node, so here it is.

### 1.1 **Setup Hardhat Environment and Deploy Smart Contracts**

- On hardhat, setup a local blockchain with `npx hardhat node` (address is *127.0.0.1:8545* by default)
- Store the **address and private key** given by the hardhat node somewhere. This will be utilized for many transactions like creating a loan, withdrawing liquidity, etc.
- While the node is running, open a new terminal and deploy the smart contracts to your local environment with
    
    ```bash
    npx hardhat run scripts/deploy.ts —network localhost
    ```
    
- Since there is no script to automate this (yet), copy the newly deployed addresses to the v1-interface environment variables in `.env.development` as well as the v1-subgraph `subgraph.yaml` contracts.
- If deploying to one of the testnets, you need to grab an Alchemy or Infura API key and add the network to `hardhat.config.ts`, like so:
    
    ```jsx
    networks: {
    	<NETWORK_NAME>: {
    		url: <ALCHEMY_HTTPS_URL>,
    		accounts: [<NETWORK_PRIVATE_KEY>,...]
    	}
    }
    ```
    

### 1.2 **Import Account into Metamask**

- In Metamask, go to *My Accounts > Import Account *****and paste the private key you copied into the input field. Now you can conduct transactions in the same environment as the graph node where it will pick up the contract’s events.
- If for some reason you need to get Metamask on the same network, [add a new one](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) with an RPC URL of *127.0.0.1:8545**.*** Make sure the chain id is *31337*. This is hardhat’s default network id, but Metamask uses 1337 so you might run into errors. See more [here](https://hardhat.org/hardhat-network/docs/metamask-issue).
- check for outdated alchemy URLs


## 2.0 **Graph Node - *localhost:8020***

This is the part where we setup the local graph node and subgraphs to listen for events triggered on GammaSwap’s smart contracts.

### 2.1 **Setup Dependencies for the graph node**

- clone the [graph node repo](https://github.com/graphprotocol/graph-node). Run `cargo build` to install its dependencies. This is going to take a while.
- start an IPFS node `ipfs daemon`. If you don’t have ipfs set up, install it online and run `ipfs init`.
- Install Postgres and run `initdb -D .postgres`. This creates a database cluster managed by a single server instance.
- To run the db, run `pg_ctl -D .postgres -l logfile start`. Similarly, you can stop the db by running the command with stop.
- create the graph-node db that will store the event data, like so:
    
    ```bash
    createdb gammaswap-graph-node
    ```
    

### 2.2 **Running the** **graph node**
To start the graph node, run this command. Make sure you make the necessary changes as needed:
```bash
cargo run -p graph-node --release -- \
--postgres-url postgresql://<DB_USERNAME>:<DB_PASS>@localhost:5432/<DB_NAME> \
--ethereum-rpc mainnet:<LOCALHOST || RPC_URL> \
--ipfs 127.0.0.1:5001 \
--debug
```
Once the graph node is running, it will begin picking up events (i.e. created subgraph, smart contract event triggers, etc.)

In my case, my database was *gammaswap-graph-node* and I’m pushing this to my [localhost](http://localhost) at port 8545. For some reason, writing mainnet for the network doesn’t really push it to mainnet.


## 3.0 **V1-Subgraph - *127.0.0.1:8000***

### 3.1 **Setup and Deploy the Subgraph**

- clone the v1-subgraph repo, and adjust the deployed contract addresses from 1.1 in `config/<NETWORK_NAME>.json`.
- install the dependencies and generate contract ABI types for the mappings later, like so:
```bash
yarn codegen && yarn build
```
This also generates a `subgraph.yaml` file, which renders in the variables based on yarn command you chose. (Not implemented fully)

- create and deploy the subgraph (make sure the graph-node is running!)
```bash
yarn create-local 
yarn deploy-local # returns subgraph ID
```

The graph node should log that it’s scanning through blocks where the event was triggered in the smart contract.

### 3.2 **Querying Events from GraphiQL explorer**

Deploying the subgraph returns the subgraph id and a link to the explorer. The explorer is located in the shape of:

```bash
http://localhost:8000/subgraphs/id/<SUBGRAPH_ID>
OR
http://localhost:8000/subgraphs/name/<SUBGRAPH_NAME>
```

Here you will make the query to fetch for the entities you want.


## Debugging
- If any error logs appear in the graph node daemon, stop the postgres instance, delete ipfs/postgres instances and try again.
- If on the client console you receive an error like this:
```bash
MetaMask - RPC Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"code":-32000,"message":"Nonce too high. Expected nonce to be 0 but got 7. Note that transactions can't be queued when automining.","data":{"message":"Nonce too high. Expected nonce to be 0 but got 7. Note that transactions can't be queued when automining."}}}}
```
Follow this [article](https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-an-account).
- Make sure all of your connections live on the same network and port. This goes for the correct deployed addresses and Alchemy URLs.
- Read through the postgres logs and graph node daemon to debug any runtime errors.
