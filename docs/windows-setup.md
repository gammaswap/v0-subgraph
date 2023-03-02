# V1-Subgraph Setup (WINDOWS/LINUX)

## Table of Contents

- [Deploy smart contracts in hardhat](#1.0-smart-contracts)
- [Run the graph node locally](#2.0-graph-node)
- [Create and deploy subgraphs to the graph node](#3.0-v1-subgraph)

## 1.0 Smart Contracts

This is to deploy smart contracts on a local environment with Hardhat. There is very little documentation integrating Hardhat with The Graph’s graph node, so here it is.

### 1.1 Setup Hardhat Environment and Deploy Smart Contracts

- Follow the instructions in the [readme.md](https://github.com/gammaswap/v1-periphery#readme0) file for v1-periphery to deploy the contracts to local hardhat network.
- call `yarn prepare` to copy v1-interface environment variables in `.env.development` to populate the v1-subgraph `subgraph.yaml` contracts.

### 1.2 Import Account into Metamask

- In Metamask, go to *My Accounts* > *Import Account*, and paste the private key you copied into the input field. Now you can conduct transactions in the same environment as the graph node where it will pick up the contract’s events.
- If for some reason you need to get Metamask on the same network, [add a new one](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) with an RPC URL of *127.0.0.1:8545*. Make sure the chain id is *31337*. This is hardhat’s default network id, but Metamask uses 1337 so you might run into errors. See more [here](https://hardhat.org/hardhat-network/docs/metamask-issue).
- check for outdated alchemy URLs


## 2.0 Graph Node

This is the part where we setup the local graph node and subgraphs to listen for events triggered on GammaSwap’s smart contracts.
### 2.1 If you are using Windows you need to set up WSL
- I used (Ubuntu 20.04 on WSL 2)[https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package] 
### 2.2 Setup Dependencies for the graph node
- Start Ubuntu and create user.
- In Linux update it using `sudo apt update`.
- Install curl if you haven't done so `sudo apt install curl`.
- Install (yarn)[https://linuxize.com/post/how-to-install-yarn-on-ubuntu-20-04/] .
#### 2.2.1 Build graph-node
- Install rust nightly `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Requires restart Ubuntu in admin mode after. 
- Check `rustc --version` exists.
- Install build-essential `sudo apt install build-essential`. (fixes cmake and cc error)
- Install pkg-config  `sudo apt-get install pkg-config`. (fixes openssl error)
- Install libssl-dev `sudo apt install libssl-dev`. (fixes openssl error)
- Install cmake `sudo apt install cmake`. (fixes cmake error)
- Install `sudo apt-get install libpq-dev` (fixes lpq error)
- Install cargo `sudo apt install cargo`. (if not installed by rust)
- Clone the [graph node repo](https://github.com/graphprotocol/graph-node). Run `cargo build` to install its dependencies. This is going to take a while.
#### 2.2.2 IPFS
- start an IPFS node `ipfs daemon`. If you don’t have ipfs set up, install it online and run `ipfs init`. (IPFS Install)[https://docs.ipfs.tech/install/command-line/#official-distributions]
#### 2.2.3 PostgreSQL
- Open a new WSL window.
- Install PostgreSQL run `sudo apt-get install postgresql-12 postgresql-client-12`.
- Start the db service, run `sudo service postgresql start`. Similarly, you can stop the db by running the command with stop.
- Change to the postgres account `sudo -i -u postgres`.
- Login to postgres command line `psql`. `\q` to exit.
- Create your role `CREATE ROLE <name> WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD '<pw>';`. Check using `\du`.
- `exit` to exit postgres command line.
- Create db with `createdb "gammaswap-graph-node";`. Check using `\l` in postgres command line.
#### 2.3 Setup Dependencies
- clone the [graph node repo](https://github.com/graphprotocol/graph-node). Run `cargo build` to install its dependencies. This is going to take a while.
- start an IPFS node `ipfs daemon`. If you don’t have ipfs set up, install it online and run `ipfs init`.
- Install Postgres and run `initdb -D .postgres`. This creates a database cluster managed by a single server instance.
- To run the db, run `pg_ctl -D .postgres -l logfile start`. Similarly, you can stop the db by running the command with stop.
- create the graph-node db that will store the event data, like so:

```bash
createdb gammaswap-graph-node
```
### 2.3 Running the graph node
- Install jq `sudo apt-get install jq`.

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

If you have errors connecting to hardhat you may need to check these things:
- check firewall has open ports private and public to graph_node-400e775eebe93a7f
- switch back to WSL1 if opening firewall doesn't fix it

## 3.0 V1-Subgraph
### 3.1 Setup and Deploy the Subgraph
- I did this step from windows but it should work from anywhere on the same machine.
- clone the v1-subgraph repo, and adjust the deployed contract addresses from 1.1 in `config/<NETWORK_NAME>.json`.
- install the dependencies and generate contract ABI types for the mappings later, like so:
```bash
yarn prepare && yarn codegen && yarn build
```
This also generates a `subgraph.yaml` file, which renders in the variables based on yarn command you chose. (Not implemented fully)

- create and deploy the subgraph (enter a version label, make sure the graph-node is running!)
```bash
yarn create-local 
yarn deploy-local # returns subgraph ID
```

The graph node should log that it’s scanning through blocks where the event was triggered in the smart contract.

### 3.2 Querying Events from GraphiQL explorer

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
