REPO ?= dfherr/symptum-backend
TAG ?= $(GITTAG)
GITTAG ?= v0.0.4

all: build push

clean:
	docker rmi $(shell docker images -q $(REPO))

build: Dockerfile
	docker build --rm -t $(REPO):$(TAG) .
	docker tag $(REPO):$(TAG) $(REPO):latest

push:
	docker push $(REPO):$(TAG)
	docker push $(REPO):latest
