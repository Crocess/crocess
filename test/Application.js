import Application from '../src/application';

import sinon from 'sinon';
import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

class MyError extends Error {
	constructor (message, foo) {
		super(message);

		this.foo = foo;
	}
}

describe('Application', () => {
    describe('#constructor()', () => {
        it('should set the parameters that passed by shell arguments to the app.', () => {
            var app = new Application();

            assert.deepEqual(app.parameters, { 'foo': 'bar' });
        });

        it('should set the parameters that passed by the specified shell arguments to the app.', () => {
            var app = new Application({
                shell_parameters_key: 'other-parameters'
            });

            assert.deepEqual(app.parameters, { 'hello': 'world' });
        });
    });

    describe('#withParameters()', () => {
        it('should set the given parameters object to the app', () => {
            var app = new Application();

            app.withParameters({ 'successful': true });

            assert.deepEqual(app.parameters, { 'successful': true });
        });
    });

    describe('#globally()', () => {
        it('should set the global_app_path options to the given.', () => {
            var app = new Application();

            app.globally('foo.app');

            assert.equal(app.options.global_app_path, 'foo.app');
        });
    });

    describe('#boot()', () => {
        it('should call the booting callback when a function give.', async () => {
            var app = new Application();

            var callback = sinon.stub();

            await app.boot(callback);

            assert.isOk(callback.called, 'the booting callback should be called.');
        });

        it('should point \'this\' of the callback to the app instance when a function give.', async () => {
            var app = new Application();

            var thisApp = null;

            var callback = function () {
                thisApp = this;
            };

            await app.boot(callback);

            assert.equal(thisApp, app);
        });

        it('should call the boot method with passing the app instance when a object give.', async () => {
            var app = new Application();

            var callback = {
                boot: sinon.spy()
            };

            await app.boot(callback);

            assert.isOk(callback.boot.calledWith(app), 'the boot method should be called with the app instance.');
        });

        it('should point the path of global object to the app instance.', async () => {
            var app = new Application().globally('foo.app');

            await app.boot(sinon.stub());

            assert.equal(global.foo.app, app);
        });

        it('should reject the promise when an exception throws.', () => {
            var app = new Application();

            var expectsError = new Error('foo');

            var callback = sinon.stub().throws(expectsError);

            return assert.isRejected(app.boot(callback), expectsError);
        });
    });

    describe('#feedbackTo()', () => {
        it('should call the feedback function when the booting callback finished.', async () => {
            var app = new Application();

            var feedback = sinon.spy();

            await app.feedbackTo(feedback).boot(function () { return 'foo'; });

            assert.isOk(feedback.calledWith('foo'), 'the feedback function should with the data that returns by booting callback.');
        });

        it('should call the callback with formatting the given object.', async () => {
            var app = new Application();

            var feedback = sinon.spy();

            await app.feedbackTo(feedback).boot(function () { return { 'foo': 'bar' }; });

            assert.isOk(feedback.calledWith('{"foo":"bar"}'), 'the feedback function should with the data that' +
                                                              ' returns by booting callback.');
        });

	    it('should call the callback with formatting the given error.', async () => {
		    var app = new Application();
		    var error = new MyError('my error', 'bar');

		    var result = null;

		    var feedback = (data) => { result = data; };
		    await app.feedbackTo(feedback).boot(function () { return error; });

		    assert.deepEqual(JSON.parse(result), {
			    name: 'Error',
			    message: 'my error',
			    stack: error.stack,
			    foo: 'bar'
		    });
	    });
    });
});
