from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db import Base

class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(Integer, primary_key=True)
    apiKey = Column(String, unique=True)
    name = Column(String, unique=True, nullable=False)

    devenvusers = relationship(
        "DevEnvUser",
        secondary="cluster_devenvuser",
        backref="clusters"
    )

    def __repr__(self):
        return f"<Cluster(id={self.id}, name='{self.name}', ...)>"

class Builder(Base):
    __tablename__ = "builders"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)

    def __repr__(self):
        return f"<Builder(id={self.id}, name='{self.name}', ...)>"


class Buildfile(Base):
    __tablename__ = "buildfiles"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    builderId = Column(Integer, ForeignKey("builders.id"))

    def __repr__(self):
        return f"<Buildfile(id={self.id}, builderId={self.builderId} name='{self.name}', ...)>"

class DevEnvUser(Base):
    __tablename__ = "devenvusers"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    buildfileId = Column(Integer, ForeignKey("buildfiles.id"))
    deleteVolume = Column(Boolean)
    clusterRoleName = Column(String)
    roleName = Column(String)
    devEnvImage = Column(String)
    containerVolumeSize = Column(String)
    homeVolumeSize = Column(String)
    email = Column(String)
    userEnvDomain = Column(String)

    def __repr__(self):
        return f"<DevEnvUser(id={self.id}, name='{self.name}', email='{self.email}', ...)>"

class ClusterDevEnvUser(Base):
    __tablename__ = "cluster_devenvuser"

    clusterId = Column(Integer, ForeignKey('clusters.id'), primary_key=True)
    devenvuserId = Column(Integer, ForeignKey('devenvusers.id'), primary_key=True)

    status = Column(String)
    cpu = Column(String)
    memory = Column(String)

    def __repr__(self):
        return f"<ClusterDevEnvUser(clusterId={self.clusterId}, devenvuserId={self.devenvuserId}, status='{self.status}', cpu='{self.cpu}', memory='{self.memory}')>"
