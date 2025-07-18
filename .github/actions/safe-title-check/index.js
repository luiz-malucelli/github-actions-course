const core = require('@actions/core');

async function run() {
    const prTitle = core.getInput('pr-title', { required: true }).trim();

    const prRegex = /^feat/;

    if (prRegex.test(prTitle)) {
        core.info('PR is a feature');
    } else {
        core.info('PR is not a feature');
    }
}

run();