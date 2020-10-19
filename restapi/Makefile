VENV_ACTIVATE_PATH = .venv/bin/activate
PORT = 8000

# Image URL to use all building/pushing image targets
IMG ?= eu.gcr.io/cloud-native-coding/cnde-rest-api:latest

install:
	rm -rf .venv
	python3 -m venv .venv
	source ${VENV_ACTIVATE_PATH} && pip install -r requirements.txt

run-prod:
	source ${VENV_ACTIVATE_PATH} && cd src && uvicorn main:app --port ${PORT}

run:
	source ${VENV_ACTIVATE_PATH} && cd src && uvicorn main:app --reload --port ${PORT}

# Build the docker image
docker-build:
	docker build . -t ${IMG}

# Push the docker image
docker-push:
	docker push ${IMG}
