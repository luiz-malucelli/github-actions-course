const core = require('@actions/core');
const exec = require('@actions/exec');
 
async function run() { 
    /**
    1. Parse inputs:
        1.1 base-branch from which to check for updates
        1.2 target-branch to use to create the PR
        1.3 Github Token for authentication purposes (to create PRs)
        1.4 Working directory for which to check for dependencies
    2. Execute the npm update command within the working directory
    3. Check whether there are modified package*.json files
    4. If there are modified files:
        4.1 Add and commit files to the target-branch
        4.2 Create a PR to the base-branch using the octokit API
    5. Otherwise, conclude the custom action
    */
  core.info('I am a custom JS action');

  const baseBranch = core.getInput('base-branch').trim();
  const targetBranch = core.getInput('target-branch').trim();
  const workingDir = core.getInput('working-directory').trim();

  const branchRegex = /^[a-zA-Z0-9_\/\-.]+$/;
  const dirRegex = /^[a-zA-Z0-9_\/\-]+$/;

  if (!branchRegex.test(baseBranch)) {
    core.setFailed('Invalid base-branch name');
    return;
  } else if (!branchRegex.test(targetBranch)) {
    core.setFailed('Invalid base-branch name');
    return;
  } else if (!dirRegex.test(workingDir)) {
    core.setFailed('Invalid working directory')
    return;
  }

  core.info(`Base branch: ${baseBranch}`);
  core.info(`Target branch: ${targetBranch}`);
  core.info(`Working directory: ${workingDir}`);

    const execOptions = {
        cwd: workingDir,
    };

  await exec.exec('npm update', null, execOptions);
  const res = await exec.getExecOutput('git status -s package*.json', null, execOptions);
  if (res.stdout.length > 0) {
    core.info('There are updates available.');
  } else {
    core.info('There are no updates available.');
  }
}

run();