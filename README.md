# ftp-backup

A tool to back up your Documents, Pictures, and folders.  
Based on npm [ssh2-sftp-client package](https://www.npmjs.com/package/ssh2-sftp-client)

## Install

You can install globally or locally.

### Global

- Install

```bash
$ npm install -g ftp-backup
```

- get help

```bash
$ ftp-backup --help
```

### Local

- Install

```bash
$ npm install ftp-backup
```

- package.json

```json
{
	"script": {
		"ftp-backup": "node node_modules/.bin/ftp-backup"
	}
}
```

- get help

```bash
npm run ftp-backup --help
```

## Usage

we can confirm usage help by `ftp-backup --help`, by default `ftp-backup` will look for the `ftp.properties` in your current folder.

we can use options like `ftp-backup --config ftp.properties ....` to specific the config file.

```
// ftp.properties
host=ftp01.asuswebstorage.com
port=22
user=user
password=pswd
source=./test
remote=/
retain=10
```
