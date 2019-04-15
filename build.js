const fs = require('fs-extra'),
	path = require('path'),
	pkg = require('./package.json'),
	config = pkg.config,
	mkdirp = require('mkdirp'),
	mkdirpSync = require('mkdirp-sync'),
	commander = require('commander'),
	themeName = config.theme_name,
	pluginName = config.plugin_name || config.theme_name,
	siteIsVIP = config.vip,
	buildParent = path.resolve(`${__dirname}/dist`),
	sourceParent = path.resolve(`${__dirname}/src`);


	commander.version(pkg.version)
	.option('-k, --keep [keep]', 'does clean the build folder if it already exists', false)
	.parse(process.argv);

const keep = !!commander.keep;

let sourceFolders = ['theme/dist', 'themes', 'plugin', 'plugins', 'mu-plugins'],
	buildFolders = ['themes', 'themes', 'plugins', 'plugins', 'mu-plugins'];

if (siteIsVIP) {
	const vipFolders = [
		'client-mu-plugins',
		'images',
		'languages',
		'private',
		'vip-config',
	];

	sourceFolders = sourceFolders.concat(vipFolders);
	buildFolders = buildFolders.concat(vipFolders);
}
if (fs.existsSync(buildParent) && !keep) {
	console.log('cleaning build folder', buildParent);
	fs.removeSync(buildParent);
	mkdirpSync(buildParent);
}

for (let index in sourceFolders) {

	let sourceName = sourceFolders[index],
		buildName = buildFolders[index],
		sourceFolder = path.join(sourceParent, sourceName),
		buildFolder = path.join(buildParent, buildName);

	if (fs.existsSync(sourceFolder)) {
		fs.readdir(sourceFolder, function (err, files) {

			if (err) console.error(err)
			else {
				if (files.length) {

					// Aptly name the theme or plugin
					if (sourceName == 'theme' || sourceName == 'theme/dist') {
						buildFolder = path.join(buildFolder, themeName);
					} else if (sourceName == 'plugin') {
						buildFolder = path.join(buildFolder, pluginName);
					}

					mkdirp(buildFolder, function (err) {

						if (err) console.error(err);
						else {
							fs.copy(sourceFolder, buildFolder, function (err) {

								if (err) return console.error(err);
								else {
									console.log(`${sourceName} copied to the build folder`, buildFolder);
								}
							});
						}
					});
				}
			}

		});
	}
}
