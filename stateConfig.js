// stateConfig.js

const stateConfig = {
    California: {
        regulationFile: 'california.js',
        policyFile: 'california.js'
    },
    Colorado: {
        regulationFile: 'colorado.js',
        policyFile: 'colorado.js'
    },
    Idaho: {
        regulationFile: 'idaho.js',
        policyFile: 'idaho.js'
    },
    Montana: {
        regulationFile: 'montana.js',
        policyFile: 'montana.js'
    },
    Nevada: {
        regulationFile: 'nevada.js',
        policyFile: 'nevada.js'
    },
    Oregon: {
        regulationFile: 'oregon.js',
        policyFile: 'oregon.js'
    },
    Washington: {
        regulationFile: 'washington.js',
        policyFile: 'washington.js'
    },
    Wyoming: {
        regulationFile: 'wyoming.js',
        policyFile: 'wyoming.js'
    }
};

export function getStates() {
    return Object.keys(stateConfig);
}

export function getRegulationFile(state) {
    return stateConfig[state]?.regulationFile;
}

export function getPolicyFile(state) {
    return stateConfig[state]?.policyFile;
}

export default stateConfig;
