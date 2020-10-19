from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from os import environ

user = environ.get("POSTGRES_USER", "postgres")
password = environ.get("POSTGRES_PASSWORD")
server = environ.get("POSTGRES_SERVER", "localhost:5432")
database = environ.get("POSTGRES_DATABASE", "postgres")

DB = f"postgresql://{user}:{password}@{server}/{database}"

engine = create_engine(DB)

DbSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
