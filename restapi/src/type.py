from typing import List
from pydantic import BaseModel, validator, root_validator
from os.path import basename

class BuilderCreate(BaseModel):
    name: str
    value: str

class BuilderGet(BuilderCreate):
    id: int

    class Config:
        orm_mode = True

class BuildfileLinks(BaseModel):
    self: str
    builder: str

class BuildfileCreate(BaseModel):
    name: str
    value: str
    builderId: int = None

class BuildfileGet(BuildfileCreate):
    id: int
    links: BuildfileLinks = None

    @validator('links', always=True)
    def add_builder(_, values):
        return BuildfileLinks(
            self=f"/buildfiles/{values['id']}",
            builder=f"/builders/{values['builderId']}"
        )

    class Config:
        orm_mode = True

class DevEnvUserCreate(BaseModel):
    name: str
    buildfileId: int = None
    deleteVolume: bool
    clusterRoleName: str
    roleName: str
    devEnvImage: str
    containerVolumeSize: str
    homeVolumeSize: str
    email: str
    userEnvDomain: str

    class Config:
        orm_mode = True

class DevEnvUserLinks(BaseModel):
    self: str
    buildfile: str = None

def transform_links(_, values):
    buildfileId = values.get('buildfileId')

    return DevEnvUserLinks(
        self=f"/devenvusers/{values['id']}",
        buildfile = f"/buildfiles/{buildfileId}" if buildfileId else None
    )

class DevEnvUserGet(DevEnvUserCreate):
    id: int
    links: DevEnvUserLinks = None

    _transform_links = validator(
        'links', allow_reuse=True, always=True
    )(transform_links)

class ClusterDevEnvUser(BaseModel):
    id: int
    buildfileId: int = None
    links: DevEnvUserLinks = None

    _transform_links = validator(
        'links', allow_reuse=True, always=True
    )(transform_links)

    class Config:
        orm_mode = True

class ClusterDevEnvUserMetricsGet(BaseModel):
    devenvuserId: int = None
    status: str = None
    cpu: str = None
    memory: str = None

    class Config:
        orm_mode = True


class ClusterDevEnvUserMetrics(BaseModel):
    devenvuserId: int = None
    devenvuser: str = None
    status: str = None
    cpu: str = None
    memory: str = None

    @root_validator()
    def add_id(cls, values):
        values['devenvuserId'] = int(basename(values['devenvuser']))
        del values['devenvuser']

        return values

class ClusterLinks(BaseModel):
    self: str
    metrics: str

class ClusterGet(BaseModel):
    apiKey: str
    name: str
    devenvusers: List[ClusterDevEnvUser] = []
    links: ClusterLinks = None

    @root_validator()
    def add_links(cls, values):
        values['links'] = ClusterLinks(
            self=f"/clusters/{values['name']}",
            metrics=f"/clusters/{values['name']}/devenvusers/metrics"
        )

        return values

    class Config:
        orm_mode = True

class ClusterCreate(BaseModel):
    name: str

