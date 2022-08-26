# v1-subgraph
GammaSwap V1 subgraph

If any error occurs during any of the following steps you can follow the following tutorial [How to run the graph-node locally (using cargo)](https://www.youtube.com/watch?v=nH_pZWgQb7g) and you can also follwo this official graph-node documentation [https://github.com/graphprotocol/graph-node](https://github.com/graphprotocol/graph-node)

1. Run ```yarn install``` to install dependencies.
2. Run ```graph init``` to initialize a graph
    
    i. Select the ```ethereum``` protocol

    ii. Select ```subgraph-studio``` product

    iii. Add Subgraph slug

    iv. Add the directory name for that subgraph

    v. Then select ```mainnet``` as Ethereum Network

    vi. Add the contract address for which you want to make the subgraph. ***(Note: This will throw an error because it will try to search for the contract on mainnet)***

    vii. Now give the abi file path

    viii. Then add contract name

    ***This will create a subgraph Boilerplate code in the present working directory***

    ix. After this cd into the contract directory

    x. Create a subgraph by filling the details of your events. ```schema.graphql``` file is used to define the schema

    xi. In ```subgraph.yaml``` file you can define which event you want to query and what handler methods should be called when those events occur

    xii. After defining the schema run ```graph codegen && graph build```. This will update the files according to the schema

    xiii. Then in the src folder you can define the handler methods that will be called when a corresponding event occurs

## Prerequisites

Enable Windows Subsystem For Linux

1. Search Turn Windows Features on or off in windows search bar and open it

2. Scroll to the bottom and enable Windows Subsystem For Linux. Then restart your computer

3. Open the [Microsoft Store](https://aka.ms/wslstore) and select your favorite Linux distribution and install it. Make sure WSL is enabled

4. To build and run the graph node project you need to have the following installed on your system. Follow this tutorial if you have any problem in installing any of the below mentioned packages/softwares. (https://www.youtube.com/watch?v=nH_pZWgQb7g)

    a. Rust (latest stable) – [How to install Rust](https://www.rust-lang.org/en-US/install.html)

    b. PostgreSQL – [PostgreSQL Downloads](https://www.postgresql.org/download/). Select Linux from the operating system options

    c. IPFS – [Installing IPFS](https://docs.ipfs.io/install/)

## Running Local Graph Node

1. Install IPFS and run ```ipfs init```

2. Install PostgreSQL and run ```sudo service postgresql start```. Optionally you can also run ```sudo service postgresql restart```.

3. Then run ```sudo su -l postgres``` followed by ```psql```

4. After starting Postgres cli, run ```CREATE ROLE <your_system_user_name> WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD '<any_password>';```. This creates a superuser role with the proper name and will allow you to connect to the database with this user/password combo. Missing this step can cause authentication issues when attempting to build the node.

5. After giving your user the database privileges run ```createdb graph-node``` to create a database.

6. If using Ubuntu, you may need to install additional packages: ```sudo apt-get install -y clang libpq-dev libssl-dev pkg-config```

7. Now open two different WSL linux distro treminals. One to run ipfs node and one for graph node

8. In the first terminal run ```ipfs node```. This will run ipfs node.

9. Now clone [https://github.com/graphprotocol/graph-node](https://github.com/graphprotocol/graph-node), and run ```cargo build```.

10. You can run the following command after changing directory to the graph-node directory. For windows users while running linux distro you can change the directory by ```cd /mnt/<directory_name>/<folder_name>```

        cargo run -p graph-node --release -- \
        --postgres-url postgresql://<postgresql_username>:<postgresql_password>@localhost:5432/graph-node \
        --ethereum-rpc mainnet:<your_alchemy_app_http_link> \
        --ipfs 127.0.0.1:5001

10. Now keep these two terminal running and go to the subgraph directory

11. From there run the following commands:

        yarn create-local
        yarn deploy-local

    **This will build and deploy the subgraph to the Graph Node. It should start indexing the subgraph immediately in the terminal where we ran cargo command.**

12. Command ```yarn deploy-local``` will print a url. This url will be used to query events on frontend. Open this url in your favourite browser After deploying the graph it will start indexing the blocks. This can take some time. Wait for it to index some blocks and then try to query

13. To query an event

        query {
            eventName {
                eventProperty
            }
        }

        For Example we want to get transfer event.

        query {
            transfer {
                id
                to
                from
                amount
            }
        }

