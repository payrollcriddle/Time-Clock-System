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
    if (stateConfig[state] && stateConfig[state].regulationFile) {
        return stateConfig[state].regulationFile;
    } else {
        console.error(`Regulation file not found for state: ${state}`);
        return null;
    }
}

export function getPolicyFile(state) {
    if (stateConfig[state] && stateConfig[state].policyFile) {
        return stateConfig[state].policyFile;
    } else {
        console.error(`Policy file not found for state: ${state}`);
        return null;
    }
}

export function getStateConfig(state) {
    if (stateConfig[state]) {
        return stateConfig[state];
    } else {
        console.error(`State configuration not found for state: ${state}`);
        return null;
    }
}

export default stateConfig;
