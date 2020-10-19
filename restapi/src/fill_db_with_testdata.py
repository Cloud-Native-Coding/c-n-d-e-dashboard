from uuid import uuid4
from random import choice

from db import DbSession, engine
import models

models.Base.metadata.drop_all(engine)
models.Base.metadata.create_all(bind=engine)
session = DbSession()

dockerfile = """
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
"""

builderfile = """
apiVersion: c-n-d-e.kube-platform.dev/v1alpha1
kind: Builder
metadata:
 name: devenv-builder-k8s-go
spec:
 template:
   initContainers:
   - name: context
     image: busybox
     args:
       - /bin/sh
       - -c
       - cp -Lr /context/. /workspace
     volumeMounts:
       - name: context
         mountPath: /context
       - name: build
         mountPath: /workspace
   containers:
   - name: kaniko
     image: gcr.io/kaniko-project/executor:latest
     args: ["--dockerfile=/workspace/Dockerfile",
             "--context=/workspace",
             "--cache=true",
             "--destination=$IMAGE_TAG"]
     volumeMounts:
       - name: kaniko-secret
         mountPath: /secret
       - name: build
         mountPath: /workspace
     env:
       - name: GOOGLE_APPLICATION_CREDENTIALS
         value: /secret/kaniko-secret.json
   restartPolicy: Never
   volumes:
     - name: kaniko-secret
       secret:
         secretName: c-n-d-e-kaniko-secret
     - name: context
       configMap:
         name: c-n-d-e-dev-env-build-k8s-go
     - name: build
       emptyDir: {}
"""

builder = models.Builder(name="LifestyleBuilder", value=builderfile)
session.add(builder)
session.flush()

buildfile = models.Buildfile(name="ActiveBuildfile", value=dockerfile, builderId=builder.id)
session.add(buildfile)
session.flush()

for name in (
    "SurfCluster",
    "PaperCluster",
    "PriorityCluster",
    "OptimalCluster",
    "InfinityCluster"
):
    session.add(models.Cluster(name=name, apiKey=str(uuid4())))

for name, mail in (
    ("Danielle Roberts", "danielle84@example.com"),
    ("Maria Boyd", "maria-boyd@example.com"),
    ("Helen Robinson", "helen-86@example.com"),
    ("Jeremy Larson", "jeremy_89@example.com"),
    ("Henry Little", "henrylittle@example.com"),
    ("Evelyn Watson", "evelyn_86@example.com")
):
    session.add(
        models.DevEnvUser(
            name = name,
            buildfileId = buildfile.id,
            deleteVolume = True,
            clusterRoleName = "view",
            roleName = "edit",
            devEnvImage = "eu.gcr.io/general-purpose-220204/dev-env:latest",
            containerVolumeSize = "10Gi",
            homeVolumeSize = "10Gi",
            email = mail,
            userEnvDomain = "kubeplatform.ch.innoq.io"
        )
    )

for cluster in range(1,4):
    for user in range(1,6):
        if choice([True, False]):
            session.add(models.ClusterDevEnvUser(
                clusterId = cluster, devenvuserId = user
            ))

session.commit()
session.close()

