# Nullcast v2

This readme will help to setup the server and the environment.

## Prerequisites

1. Node and npm.

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
        source ~/.bashrc
        nvm install vxx.x.x (12+ is required)

2. setup a postgres database

            // Refresh the apt-get repository
               sudo apt-get update
            // Install PostgreSQL
               sudo apt-get install postgresql

    This will install postgresql with a user `postgres` with sudo permissions. You can login to your `postgres` user by

                sudo -u postgres psql

    We will be creating an another user. Before that edit the following file to remove superuser privilages for new user

                sudo nano /etc/postgresql/12/main/pg_hba.conf

    On the bottom of the file, below `# "local" is for Unix domain socket connections only`. Change value `peer` to `password` or `trust`(no password required for `trust`). Yes, you can change the `postgres` user privilage, but we probably be using a new user.

    Now create a user and database with the same name by

                sudo -u postgres createuser --superuser <username>
                sudo -u postgres createdb <username>

    Now change the CONNECTIONSTRING value in `.env` to connect to your database

## Let's start the server

Clone the repo `https://github.com/Planet-NULLCAST/nullcast-server-fastify.git`

            npm install
            npm run build
            npm start
