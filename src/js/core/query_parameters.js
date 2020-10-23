const queryString = require("query-string");
const options = queryString.parse(location.search);

export let queryParamOptions = {
    embedProvider: null,
    fullVersion: false,
    sandboxMode: false,
    password: null,
};

if (options.embed) {
    queryParamOptions.embedProvider = options.embed;
}

// Allow testing full version outside of standalone
if (options.fullVersion && !G_IS_RELEASE) {
    queryParamOptions.fullVersion = true;
}

// Allow testing full version outside of standalone
if (options.sandboxMode && !G_IS_RELEASE) {
    queryParamOptions.sandboxMode = true;
}

// Allow testing full version outside of standalone
if(options.password && !G_IS_RELEASE) {
    queryParamOptions.password = options.password;
}
