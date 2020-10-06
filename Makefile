NAME=$(or ${CONTAINER_NAME},kids-morning-paper)

.PHONY: build
build:
	docker build -t $(NAME) .

dev:
	npx concurrently --kill-others "cd fakes && docker-compose up --build" "npm start"

unittests:
	cd src && npm run unittests