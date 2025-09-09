// placeholder helpers for GitHub integration
const fetch = require('node-fetch');

async function fetchRepoStats(repoUrl){
  // expects full repo url like https://github.com/owner/repo
  try{
    const m = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/)/);
    if(!m) return null;
    const owner = m[1], repo = m[2];
    const api = `https://api.github.com/repos/${owner}/${repo}`;
    const r = await fetch(api);
    if(r.status !== 200) return null;
    const data = await r.json();
    return {stars: data.stargazers_count, forks: data.forks_count, open_issues: data.open_issues_count, description: data.description};
  }catch(e){ return null; }
}

module.exports = { fetchRepoStats };
