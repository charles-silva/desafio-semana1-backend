const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();
const routes = express.Router();

app.use(express.json());
app.use(cors());

const mRepositories = [];


function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid repository ID.' });
  }

  const repository = mRepositories.find(repo => repo.id === id);
  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);



app.get("/repositories", (request, response) => {
  response.json(mRepositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  mRepositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = mRepositories.find(repo => repo.id === id);

  // if (!repository) {
  //   return response.status(400).json({ error: 'Repository not found.' });
  // }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const repositoryIndex = mRepositories.findIndex(repo => repo.id === id);

  // if (repositoryIndex < 0) {
  //   return response.status(400).json({ error: 'Repository not found to delete.' });
  // }

  //console.log(repositoryIndex);
  mRepositories.splice(repositoryIndex, 1);
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = mRepositories.find(repo => repo.id === id);

  // if (!repository) {
  //   return response.status(400).json({ error: 'Repository not found.' });
  // }

  repository.likes++;
  return response.json(repository);
});

module.exports = app;
