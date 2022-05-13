const Backoff = (retries) => {
    let expBackoff =  Math.pow(2, retries);
    let maxjitter = Math.ceil(expBackoff*0.2);
    let jitter = Math.floor((Math.random() * maxjitter) + 1);
    let finalBackoff = expBackoff + jitter;

    return finalBackoff;
}

module.exports = Backoff;