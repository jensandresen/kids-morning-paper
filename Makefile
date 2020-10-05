dev:
	npx concurrently --kill-others "cd fakes && docker-compose up --build" "npm start"