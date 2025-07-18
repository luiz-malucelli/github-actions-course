const core = require('@actions/core');

async function run() {
    try {
        const prTitle = core.getInput('pr-title', { required: true }).trim();
        const prRegex = /^feat/;
    
        if (prRegex.test(prTitle)) {
            core.info('PR is a feature');
        } else {
            core.setFailed('PR is not a feature');
        }
    } catch (e) {
        core.setFailed(e.message);
    }
}

run();