const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (likes) {
    return response.json(repositories[repoIndex]);
  }

  if (repoIndex < 0) {
    return response.status(400).send("Repository does not exists");
  }

  const repo = {
    id,
    title,
    url,
    techs,
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).send("Repository does not exists");
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).send("Repository does not exists");
  }

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
