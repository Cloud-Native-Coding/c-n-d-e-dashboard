from typing import List

from fastapi import Depends, FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import queries, models, type
from db import DbSession, engine


# models.Base.metadata.drop_all(engine)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

def get_session():
    try:
        s = DbSession()
        yield s
    finally:
        s.close()


# /clusters

@app.get("/clusters/", response_model=List[type.ClusterGet])
def get_clusters(session: Session = Depends(get_session)):
    return queries.get_clusters(session)

@app.get("/clusters/{name}", response_model=type.ClusterGet)
def get_cluster(name: str, session: Session = Depends(get_session)):
    cluster = queries.get_cluster(session, name)

    if cluster is None:
        raise HTTPException(status_code=404, detail="Cluster not found")

    return cluster

@app.post("/clusters/", response_model=type.ClusterGet, status_code=201)
def create_cluster(cluster: type.ClusterCreate, session: Session = Depends(get_session)):
    return queries.create_cluster(session, cluster)

@app.delete("/clusters/{name}", status_code=204)
def delete_cluster(name: str, session: Session = Depends(get_session)):
    cluster = queries.get_cluster(session, name)

    if cluster is not None:
        queries.delete_cluster(session, cluster)

# dev env users

@app.get("/devenvusers/", response_model=List[type.DevEnvUserGet])
def get_devenvusers(session: Session = Depends(get_session)):
    return queries.get_devenvusers(session)

@app.get("/devenvusers/{id}", response_model=type.DevEnvUserGet)
def get_devenvuser(id: int, session: Session = Depends(get_session)):
    user = queries.get_devenvuser(session, id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@app.post("/devenvusers/", response_model=type.DevEnvUserGet, status_code=201)
def create_devenvuser(devenvuser: type.DevEnvUserCreate, session: Session = Depends(get_session)):
    return queries.create_devenvuser(session, devenvuser)

@app.put("/devenvusers/{id}", status_code=204)
def update_devenvuser(id: int, values: type.DevEnvUserCreate, session: Session = Depends(get_session)):
    queries.update_devenvuser(session, id, values)

@app.delete("/devenvusers/{id}", status_code=204)
def delete_cluster(id: int, session: Session = Depends(get_session)):
    devenvuser = queries.get_devenvuser(session, id)

    if devenvuser is not None:
        queries.delete_devenvuser(session, devenvuser)


# clusters dev env users

@app.post("/clusters/{name}/devenvusers/{id}", status_code=201)
def add_devenvuser_to_cluster(name: str, id: int, session: Session = Depends(get_session)):
    cluster = queries.get_cluster(session, name)

    if cluster is None:
        raise HTTPException(status_code=404, detail="Cluster not found")

    user = queries.get_devenvuser(session, id)

    if user is None:
        raise HTTPException(status_code=404, detail="Dev env user not found")

    dc = queries.add_devenvuser_to_cluster(session, cluster.id, user.id)

    return {}

@app.put("/clusters/{name}/devenvusers/metrics", status_code=204)
def update_devenvusers_metrics(name: str, metrics: List[type.ClusterDevEnvUserMetrics], session: Session = Depends(get_session)):
    cluster = queries.get_cluster(session, name)

    if cluster is None:
        raise HTTPException(status_code=404, detail="Cluster not found")

    for metric in metrics:
        queries.update_cluster_devenvuser_metric(
            session, cluster.id, **metric.dict()
        )

@app.get("/clusters/{name}/devenvusers/metrics", response_model=List[type.ClusterDevEnvUserMetricsGet])
def get_devenvusers_metrics(name: str, session: Session = Depends(get_session)):
    cluster = queries.get_cluster(session, name)

    if cluster is None:
        raise HTTPException(status_code=404, detail="Cluster not found")

    return queries.get_cluster_devenvuser_metrics(
        session,
        cluster.id
    )

@app.delete("/clusters/{name}/devenvusers/{id}", status_code=204)
def remove_devenvuser_from_cluster(name: str, id: int, session: Session = Depends(get_session)):
    cluster = queries.get_cluster(session, name)

    if cluster is None:
        return

    dc = queries.get_devenvuser_cluster(session, cluster.id, id)

    if dc is None:
        return

    queries.remove_devenvuser_from_cluster(session, dc)

# builder

@app.get("/builders/", response_model=List[type.BuilderGet])
def get_builders(session: Session = Depends(get_session)):
    return queries.get_builders(session)

@app.get("/builders/{id}", response_model=type.BuilderGet)
def get_builder(id: int, session: Session = Depends(get_session)):
    builder = queries.get_builder(session, id)

    if builder is None:
        raise HTTPException(status_code=404, detail="Builder not found")

    return builder

@app.post("/builders/", response_model=type.BuilderGet, status_code=201)
def create_builder(builder: type.BuilderCreate, session: Session = Depends(get_session)):
    return queries.create_builder(session, builder)

@app.put("/builders/{id}", status_code=204)
def update_builder(id: int, values: type.BuilderCreate, session: Session = Depends(get_session)):
    return queries.update_builder(session, id, values)

@app.delete("/builders/{id}", status_code=204)
def delete_builder(id: int, session: Session = Depends(get_session)):
    builder = queries.get_builder(session, id)

    if builder is not None:
        queries.delete_builder(session, builder)


# buildfile

@app.get("/buildfiles/", response_model=List[type.BuildfileGet])
def get_buildfiles(session: Session = Depends(get_session)):
    return queries.get_buildfiles(session)

@app.get("/buildfiles/{id}", response_model=type.BuildfileGet)
def get_buildfile(id: int, session: Session = Depends(get_session)):
    buildFile = queries.get_buildfile(session, id)

    if buildFile is None:
        raise HTTPException(status_code=404, detail="Build File not found")

    return buildFile

@app.post("/buildfiles/", response_model=type.BuildfileGet, status_code=201)
def create_devenvuser(buildfile: type.BuildfileCreate, session: Session = Depends(get_session)):
    return queries.create_buildfile(session, buildfile)

@app.put("/buildfiles/{id}", status_code=204)
def get_buildfile(id: int, values: type.BuildfileCreate, session: Session = Depends(get_session)):
    return queries.update_buildfile(session, id, values)

@app.delete("/buildfiles/{id}", status_code=204)
def delete_cluster(id: int, session: Session = Depends(get_session)):
    buildfile = queries.get_buildfile(session, id)

    if buildfile is not None:
        queries.delete_buildfile(session, buildfile)

