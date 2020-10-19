# c-n-d-e-dashboard

## rest api

Dependencies (see reqiurements.txt for the full list)

* [FastAPI](https://fastapi.tiangolo.com/)
* [pydantic](https://pydantic-docs.helpmanual.io/)
* [Uvicorn](https://www.uvicorn.org/)
* [SQLAlchemy](https://www.sqlalchemy.org/)

## database

environment variables needed for the db connection:

- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_SERVER
- POSTGRES_DATABASE

## docker

```sh
$ docker build -t cnde-rest-api .
```

```sh
docker run -it -p 8000:8000 --rm --name api cnde-rest-api
```

## local installation

requires python3 and make

```sh
$ make install
```

## run api server in developlent mode

```sh
$ make run [PORT=8000]
```

## run api server

```sh
$ make run-prod [PORT=8000]
```

## api docs

run the server and visit /docs or /redoc

