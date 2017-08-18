class Suite
{
	/**
	 * Create a new suite.
	 *
	 * @abstract
	 */
	constructor () {
		//
	}

    /**
     * Boot this suite.
     *
     * @param {Application} app - The crocess application instance.
     *
     * @returns {Promise}
     */
    async boot(app)
    {
        this.app = app;

        try {
            await this.register();

            var data = await this.handle();

            await this.finish();

            return data;
        } finally {
            await this.cleanUp();
        }
    }

    /**
     * Register things before starting handle the suite.
     *
     * @returns {Promise}
     */
    async register() {
        //
    }

    /**
     * Start handling the suite.
     *
     * @returns {Promise}
     */
    async handle() {
        //
    }

    /**
     * Finish handling the suite.
     *
     * @returns {Promise}
     */
    async finish() {
        //
    }

    /**
     * Clean up for the suite.
     *
     * @returns {Promise}
     */
    async cleanUp() {
        //
    }
}

export default Suite;
