<p align="center">
    <a href="https://github.com/WillianBL99/repo-provas">
      <img src="https://github.com/WillianBL99/gopher-todo_list/assets/65803142/fc32a68b-929e-4849-8f66-d5d875f5456f" width="180" >
    </a>
    <h1 align="center">
      Galax Stations
    </h1>
</p>
</br>

## :page_facing_up: About

The Galaxy Station API is a platform dedicated to managing spacecraft charging stations. This powerful API was developed in Node.js, with PostgreSQL as its backing database. It uses GraphQL as a communication protocol to interact with customers, providing an efficient and flexible experience.

## :rocket: Technologies used
The project was developed using the following technologies:

- <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
- <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
- <img src="https://img.shields.io/badge/Apollo_Server-4B89FF?style=for-the-badge&logo=apollo-graphql&logoColor=white" alt="Apollo Server" />
- <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
- <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
- <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
- <img src="https://img.shields.io/badge/Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Script" />

## :warning: Prerequisites
>To run the project locally, you must have installed:
- [Node](https://nodejs.org/) - v20.9.0
- [PostgreSQL](https://www.postgresql.org/) - (or use [Docker](https://www.docker.com/))

>To run the project in a container, you must have installed:
- [Docker](https://www.docker.com/)

## :cd: Usage
### How to run for development (locally)

1. Clone this repository and install all dependencies.

      ```bash
      $ git clone https://https://github.com/WillianBL99/galaxy-stations.git

      $ cd galaxy-stations

      $ npm install
      ```

2. Create and configure the `.env` file based on the `.env.example` file.

4. Run the API

      ```bash
      $ npm run start:local
      ```

The API will display `Apollo Server running on port <port>` if everything is correct.

### How to run tests for development (locally)

1. Run the command below to run the tests.

      ```bash
      $ npm run test
      ```

### How to run for development (Docker)

#### Up system
Run the docker-compose.
```bash
     $ docker-compose -f docker-compose.develop.yaml up --build
```

#### Observe bank data with Prisma Studio
1. To run locally, run the command below.
```bash
     $ npm run prisma:studio
```
2. To display the database in the system container, run the `prisma_studio.sh` script.
```bash
     $ chmod +x ./prisma_studio.sh
     $ ./prisma_studio.sh
```

## :twisted_rightwards_arrows: Routes available in the API
Above are the routes available in the API. For more details, see the documentation available at [gopher-todolist.onrender.com](https://gopher-todolist.onrender.com/).

## :page_facing_up: License
This project is under the [MIT License](https://github.com/WillianBL99/gopher-todo_list/blob/main/LICENSE)

---
Developed by **Paulo Uilian Barros Lago**🧑🏻‍💻