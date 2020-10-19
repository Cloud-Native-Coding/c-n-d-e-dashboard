from sqlalchemy.orm import Session
from uuid import uuid4

import models, type


# Cluster
def get_cluster(session: Session, name: str):
    return session.query(models.Cluster).filter(models.Cluster.name == name).first()

def get_clusters(session: Session):
    return session.query(models.Cluster).all()

def create_cluster(session: Session, cluster: type.ClusterCreate):
    c = models.Cluster(name=cluster.name, apiKey=str(uuid4()))
    session.add(c)
    session.commit()
    session.refresh(c)
    return c

def delete_cluster(session: Session, cluster: models.Cluster):
    session.delete(cluster)
    session.commit()


# DevEnvUser
def get_devenvuser(session: Session, id: int):
    return session.query(models.DevEnvUser).filter(models.DevEnvUser.id == id).first()

def get_devenvusers(session: Session):
    return session.query(models.DevEnvUser).all()

def create_devenvuser(session: Session, devenvuser: type.DevEnvUserCreate):
    u = models.DevEnvUser(**devenvuser.dict())
    session.add(u)
    session.commit()
    session.refresh(u)
    return u

def update_devenvuser(session: Session, id: int, values: type.BuilderCreate):
    session.query(models.DevEnvUser).filter_by(id = id).update(values)
    session.commit()

def delete_devenvuser(session: Session, devenvuser: models.DevEnvUser):
    session.delete(devenvuser)
    session.commit()

# ClusterDevEnvUser
def get_devenvuser_cluster(session: Session, clusterId, devenvuserId):
    return session.query(models.ClusterDevEnvUser).filter_by(
        clusterId = clusterId,
        devenvuserId = devenvuserId
    ).first()

def add_devenvuser_to_cluster(session: Session, clusterId, devenvuserId):
    cd = models.ClusterDevEnvUser(
            clusterId = clusterId,
            devenvuserId = devenvuserId
         )

    session.add(cd)
    session.commit()
    session.refresh(cd)
    return cd

def remove_devenvuser_from_cluster(session: Session, cd: models.ClusterDevEnvUser):
    session.delete(cd)
    session.commit()

def update_cluster_devenvuser_metrics(session: Session, mappings):
    session.bulk_update_mappings(models.ClusterDevEnvUser, mappings)
    session.commit()

def update_cluster_devenvuser_metric(session: Session, clusterId, devenvuserId, **kwargs):

    session.query(models.ClusterDevEnvUser).filter_by(
        clusterId = clusterId,
        devenvuserId = devenvuserId
        ).update(kwargs)

    session.commit()

def get_cluster_devenvuser_metrics(session: Session, clusterId: int):
    return session.query(models.ClusterDevEnvUser).filter_by(
        clusterId = clusterId
    ).all()


# Builder
def get_builder(session: Session, id: int):
    return session.query(models.Builder).filter(models.Builder.id == id).first()

def get_builders(session: Session):
    return session.query(models.Builder).all()

def create_builder(session: Session, builder: type.BuilderCreate):
    b = models.Builder(**builder.dict())
    session.add(b)
    session.commit()
    session.refresh(b)
    return b

def update_builder(session: Session, id: int, values: type.BuilderCreate):
    session.query(models.Builder).filter_by(id = id).update(values)
    session.commit()

def delete_builder(session: Session, builder: models.Builder):
    session.delete(builder)
    session.commit()


# Buildfile
def get_buildfile(session: Session, id: int):
    return session.query(models.Buildfile).filter(models.Buildfile.id == id).first()

def get_buildfiles(session: Session):
    return session.query(models.Buildfile).all()

def create_buildfile(session: Session, buildfile: type.BuildfileCreate):
    f = models.Buildfile(**buildfile.dict())
    session.add(f)
    session.commit()
    session.refresh(f)
    return f

def update_buildfile(session: Session, id: int, values: type.BuildfileCreate):
    session.query(models.Buildfile).filter_by(id = id).update(values)
    session.commit()

def delete_buildfile(session: Session, buildfile: models.Buildfile):
    session.delete(buildfile)
    session.commit()

