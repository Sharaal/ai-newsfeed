module.exports = async function wait(seconds = 60) {
    console.log(`Waiting ${seconds} seconds...`);
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
