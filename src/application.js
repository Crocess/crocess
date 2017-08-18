import _ from 'lodash';
import { argv } from 'yargs';

class Application {
	/**
	 * Create a new application object.
	 */
	constructor (options = {}) {
		this.options = {
			shell_parameters_key: 'parameters',
			global_app_path: null,
			result_begin_identifier: '>>>>>BEGIN_RESULT>>>>>'
		};

		this.options = _.merge(this.options, options);

		this.parameters = this.getParameters();

		this._feedback = this._printResult;
	}

	/**
	 * Get the parameters object.
	 *
	 * @returns {Object}
	 */
	getParameters () {
		var parametersJson = argv[this.options.shell_parameters_key];

		if (! parametersJson) {
			return {};
		}

		return JSON.parse(parametersJson);
	}

	/**
	 * Manually set the parameters object on the application.
	 *
	 * @param {object} parameters - The parameters object to set.
	 *
	 * @returns {Application}
	 */
	withParameters (parameters) {
		this.parameters = parameters;

		return this;
	}

	/**
	 * Register things.
	 *
	 * @returns {Promise}
	 */
	async register () {
		this._registerAppToGlobal();
	}

	/**
	 * Boot the application.
	 *
	 * @param {object|function} callback - The booting callback function.
	 *
	 * @returns {Promise}
	 */
	async boot (callback) {
		await this.register();

		var data = null;

		switch (typeof(callback)) {
			case 'object':
				data = await callback.boot(this);

				break;

			case 'function':
				data = await callback.apply(this);

				break;

			default:
				throw new Error('Unable to boot unknown type of the application program.');
		}

		// Send the feedback.
		if (data) {
			this._feedback(this._formatResult(data));
		}
	}

	/**
	 * Format the given result to JSON.
	 *
	 * @param {string|object|Error} data
	 *
	 * @private
	 * @returns {string}
	 */
	_formatResult (data) {
		if (typeof data == 'string') {
			return data;
		}

		if (data instanceof Error) {
			return this._stringifyError(data);
		}

		if (typeof data == 'object') {
			return JSON.stringify(data);
		}
	}

	/**
	 * Stringify the given error.
	 *
	 * @param {Error} error
	 *
	 * @private
	 * @returns {string}
	 */
	_stringifyError(error) {
		var json = {};

		// Copy basic properties.
		json.name = error.name;
		json.message = error.message;
		json.stack = error.stack;

		// Copy other properties.
		for (let key of _.keys(error)) {
			json[key] = error[key];
		}

		return JSON.stringify(json);
	}

	/**
	 * Make the application instance be exist in the global object.
	 *
	 * @param {string} path - The path to register to the global object.
	 *
	 * @returns {Application}
	 */
	globally (path = 'app') {
		this.options.global_app_path = path;

		return this;
	}

	/**
	 * Set the app instance to the global object if the path is specified.
	 *
	 * @private
	 * @returns void
	 */
	_registerAppToGlobal () {
		if (this.options.global_app_path) {
			_.set(global, this.options.global_app_path, this);
		}
	}

	/**
	 * Delivers the data feedback to the given callback.
	 *
	 * @param {function} callback - The function will be called when the feedback delivers.
	 *
	 * @returns {Application}
	 */
	feedbackTo (callback) {
		this._feedback = callback;

		return this;
	}

	/**
	 * Print the result data to console.
	 *
	 * @param {object|string} data - The data to print.
	 *
	 * @private
	 * @returns void
	 */
	_printResult (data) {
		console.log(
			this.options.result_begin_identifier + data
		);
	}
}

export default Application;
