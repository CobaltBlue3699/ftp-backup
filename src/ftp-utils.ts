import sftp from 'ssh2-sftp-client';
import ora, { Ora } from 'ora';
export class SFTPUtils {
	#client: sftp;
	#spinner: Ora = ora();

	constructor(client: sftp) {
		if (typeof client === 'undefined') {
			throw new Error('Cannot be called directly');
		}
		this.#client = client;
		this.#client.on('error', (err) => {
			this.#client.end();
			this.#spinner.stop();
		});
	}

	/**
	 * get connected instance
	 * @param {string} host
	 * @param {number} port
	 * @param {string} username
	 * @param {string} password
	 * @returns connected sftp instance
	 */
	static async build(
		host: string,
		port: number,
		username: string,
		password: string,
	): Promise<SFTPUtils> {
		const sftpInstance = new sftp();
		const utils = new SFTPUtils(sftpInstance);
		await utils.involk(
			`connect sftp`,
			async () =>
				await sftpInstance.connect({
					host,
					port,
					username,
					password,
				}),
		);
		return utils;
	}

	/**
	 * get remote dirctory's files and folders
	 * @param {string} remote
	 * @param {string | RegExp} pattern
	 * @returns Promise<sftp.FileInfo[]> remote
	 */
	async list(remote: string, pattern?: string | RegExp): Promise<sftp.FileInfo[]> {
		return await this.#client.list(remote, pattern);
	}

	/**
	 * mkdir
	 * @param remote
	 * @returns remote path
	 */
	async mkdir(remote: string): Promise<string> {
		return this.involk(`mkdir ${remote}`, async () => await this.#client.mkdir(remote, true));
	}

	/**
	 * upload entire folder to remote
	 * @param source
	 * @param remote
	 * @returns
	 */
	async uploadDir(source: string, remote: string): Promise<string> {
		return this.involk(
			`uploading ${source} to remote ${remote}`,
			async () => await this.#client.uploadDir(source, remote),
		);
	}

	/**
	 * get remote dirctory's files
	 * @param remote
	 * @returns Promise<sftp.FileInfo[]>
	 */
	async getFiles(remote: string): Promise<sftp.FileInfo[]> {
		const dir = await this.list(remote);
		return dir.filter((tmp) => tmp.type === '-');
	}

	/**
	 * get remote dirctory's folders
	 * @param remote
	 * @returns Promise<sftp.FileInfo[]>
	 */
	async getFolders(remote: string, pattern?: string | RegExp): Promise<sftp.FileInfo[]> {
		const dir = await this.list(remote, pattern);
		return dir.filter((tmp) => tmp.type === 'd');
	}

	/**
	 * check if the file or folder exists
	 * @param {string} path
	 * @returns Promise<false | 'd' | 'l' | '-'>
	 * – : regular file
	 * d : directory
	 * l : symbolic link
	 */
	async exists(path: string): Promise<false | 'd' | 'l' | '-'> {
		return this.involk(`check if ${path} is existed`, async () => await this.#client.exists(path));
	}

	/**
	 * remove folder
	 * @param {string} remote
	 * @returns
	 */
	async rmdir(remote: string): Promise<string> {
		return this.involk(
			`remove remote ${remote}`,
			async () => await this.#client.rmdir(remote, true),
		);
	}

	async disconnect(): Promise<void> {
		return this.involk(`disconnect`, async () => await this.#client.end());
	}

	async involk<T>(action: string, func: () => Promise<T | any>) {
		this.#spinner.text = `start ${action}`;
		if (!this.#spinner.isSpinning) {
			this.#spinner.start();
		}
		try {
			const result = await func();
			this.#spinner.succeed(`succeed ${action}`);
			return result;
		} catch (err: any) {
			this.#spinner.fail(`failed to ${action},  ${err.message}`);
			return new Promise((resolve, reject) => {
				reject(err);
			});
		}
	}
}
