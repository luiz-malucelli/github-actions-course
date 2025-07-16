const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

const setupLogger = ({ debug, prefix } = { debug: false, prefix: ''}) => ({
    debug: (message) => {
        if (debug) {
            core.info(`DEBUG ${prefix}${prefix ? ' : ' : ''}${message}`);
        }
    },
    info: (message) => {
        core.info(`${prefix}${prefix ? ' : ' : ''}${message}`);1
    },
    error: (message) => {
        core.error(`${prefix}${prefix ? ' : ' : ''}${message}`);
    }
}); 
 
async function run() { 
  const baseBranch = core.getInput('base-branch', { required: true }).trim();
  const targetBranch = core.getInput('target-branch', { required: true }).trim();
  const headBranch = core.getInput('head-branch').trim() || targetBranch;
  const ghToken = core.getInput('gh-token', { required: true }); 
  const workingDir = core.getInput('working-directory', { required: true }).trim();
  const debug = core.getBooleanInput('debug');
  const logger = setupLogger({ debug: debug, prefix: '[js-dependency-update]'});

  core.setSecret(ghToken);

  async function setupGit() {
    await exec.exec('git config user.name "github-actions[bot]"', [], execOptions);
    await exec.exec('git config user.email "github-actions[bot]@users.noreply.github.com"', [], execOptions);
  }

  const branchRegex = /^[a-zA-Z0-9_\/\-.]+$/;
  const dirRegex = /^[a-zA-Z0-9_\/\-]+$/;

  logger.debug('Validating inputs base-branch, head-branch, working-directory')

  if (!branchRegex.test(baseBranch)) {
    core.setFailed('Invalid base-branch name. Branch names should only contain letters, digits, underscores, hyphens, dots, and forward slashes');
    return;
  } else if (!branchRegex.test(headBranch)) {
    core.setFailed('Invalid target-branch name. Branch names should only contain letters, digits, underscores, hyphens, dots, and forward slashes');
    return;
  } else if (!dirRegex.test(workingDir)) {
    core.setFailed('Invalid working-directory name. Directory names should only contain letters, digits, underscores, hyphens, and forward slashes')
    return;
  }

  logger.debug(`Base branch: ${baseBranch}`);
  logger.debug(`Target branch: ${headBranch}`);
  logger.debug(`Working directory: ${workingDir}`);

  const execOptions = {
    cwd: workingDir,
  };

  logger.debug('Checking for package updates');
  await exec.exec('npm update', [], execOptions);

  const gitStatus = await exec.getExecOutput('git status -s package*.json', [], execOptions);
  if (gitStatus.stdout.length > 0) {
    logger.info('There are updates available.');
    await exec.exec(`git checkout -b ${headBranch}`, [], execOptions);
    await exec.exec('git add package.json package-lock.json', [], execOptions);
    const now = new Date();
    logger.debug('Setting up git credentials');
    await setupGit();

    logger.debug('Commiting and pushing package*.json changes');
    await exec.exec(`git commit -m "[js-dependency-update] : update dependencies"`, [], execOptions);
    await exec.exec(`git push -u origin ${headBranch} --force`, [], execOptions);

    logger.debug('Fetching octokit API');
    const octokit = github.getOctokit(ghToken);

    try {
        logger.debug(`Creating PR using head branch ${headBranch}`);
        await octokit.rest.pulls.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        title: `Update NPM dependencies`,
        body: `This pull request updates NPM packages`,
        base: baseBranch,
        head: headBranch 
        });
    } catch (e) {
        logger.error('Something went wrong while creating the PR. Check logs below.');
        core.setFailed(e.message);
        logger.error(e);
    }
  } else {
    logger.info('No updates at this point in time.');
  }
}

run();