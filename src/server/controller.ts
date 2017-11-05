import * as _ from 'lodash'
import * as express from 'express'
import * as request from 'request-promise'

interface GithubConfig {
  url: string;
  authToken: string;
  repositories: [RepoConfig];
}

interface RepoConfig {
  owner: string;
  repo: string;
}

const controller = ({config}) => {

  const router = express.Router();
  const githubConfig: GithubConfig = config.github;
  const baseRequest = request.defaults({
    baseUrl: githubConfig.url,
    json: true,
    headers: {
      'Authorization': `token ${githubConfig.authToken}`,
      'User-Agent': 'github-dashboard',
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  router.use('/repos', (req, res, next) => {
    if (githubConfig.authToken === null) {
      return res.status(400).send('authToken is not configured');
    }
    next();
  });

  router.get('/repos', (req, res) => {
    res.json(githubConfig.repositories);
  });

  router.get('/repos/:owner/:repo/pull-requests', (req, res) => {
    const {owner, repo} = req.params;
    const promise = baseRequest.get({
      url: `/repos/${owner}/${repo}/pulls`,
      qs: req.query
    });
    const onFulfilled = (response) => {
      res.json(response);
    };
    const onRejected = (error) => {
      res.send(error);
    };
    promise.then(onFulfilled).catch(onRejected);
  });

  router.get('/repos/pull-requests', (req, res) => {
    const promises = _.map(githubConfig.repositories, (repoConfig: RepoConfig) => {
      const {owner, repo} = repoConfig;
      return baseRequest.get({
        url: `/repos/${owner}/${repo}/pulls`,
        qs: req.query
      });
    });
    const onFulfilled = (responses) => {
      res.json(_.flatten(responses));
    };
    const onRejected = (error) => {
      res.send(error);
    };
    Promise.all(promises).then(onFulfilled).catch(onRejected);
  });
  
  return router;
};

export {controller};