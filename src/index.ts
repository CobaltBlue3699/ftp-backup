#!/usr/bin/env node
import { SFTPUtils } from './ftp-utils';
import PropertiesReader from 'properties-reader';
import minimist from 'minimist';
import { isString } from './utils';
import * as path from 'path';

(async (argv) => {
	// init Ftp script
	if (argv.version) {
		console.log('v' + require('../package.json').version);
	} else if (argv.help) {
		console.log(`
      Usage
        $ ftp-backup [options]
            Options
              --config [config path]
              --help
              --version
      Examples
        $ ftp-backup --config=test/ftp.properties
        $ ftp-backup --version
        $ ftp-backup --help
    `);
	} else {
		// check the properties
		const { host, port, user, password, remote, source, retain } = Object.assign(
			{
				port: 22,
				retain: 7, // default retain 7 backup instance
			},
			PropertiesReader(
				path.resolve(process.cwd(), argv.config || 'ftp.properties'),
			).getAllProperties(),
		);
		isString('host', host);
		isString('user', user);
		isString('password', password);
		isString('remote', remote);
		isString('source', source);

		const sftp = await SFTPUtils.build(host, port, user, password);
		if (!(await sftp.exists(remote))) {
			// if remote folder is not exist, then create it.
			await sftp.mkdir(remote);
		}
		await sftp.uploadDir(source, remote);
		// const dirs = await sftp.list(remote)

		// console.log(dirs);
	}
})(minimist(process.argv.slice(2)));
