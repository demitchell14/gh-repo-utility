import Repository from "./repository";

export { Repository };

// (async function() {
//     const repo = new Repository({
//         token: process.env.GITHUB_TOKEN as string,
//         repository: 'demitchell14/ams-client'
//     })
//
//
//     const releases = await repo.getReleasesInfo();
//     const latest = releases[0];
//
//     if (latest.assets.length > 0) {
//         const asset = latest.assets[0];
//
//         const buffer = await asset.download(true);
//         console.log(buffer)
//
//         // const readable = new Readable();
//         // readable._read = () => {};
//         // readable.push(buffer);
//         // readable.push(null);
//         // readable.pipe(unzipper.Extract({ path: 'build' }));
//
//     }
// })();