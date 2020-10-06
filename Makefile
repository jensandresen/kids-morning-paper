NAME=$(or ${CONTAINER_NAME},kids-morning-paper)

dev:
	npx concurrently --kill-others "cd fakes && docker-compose up --build" "npm start"

unittests:
	cd src && npm run unittests

.PHONY: build
build:
	docker build -t $(NAME) .

setup: build

run:
	-docker rm $(NAME)
	docker run -d \
		-p 16000:80 \
		--restart unless-stopped \
		--name $(NAME) \
		$(NAME)

teardown:
	-docker kill $(NAME)