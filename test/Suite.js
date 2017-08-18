import Suite from '../src/suite';

import sinon from 'sinon';
import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

describe('Suite', () => {
    describe('#boot()', () => {
        it('should set the app property as the given.', async () => {
            var suite = new Suite();
            var app = new Object;

            await suite.boot(app);

            assert.equal(suite.app, app);
        });

        it('should call its stage methods in order.', async () => {
            var suite = new Suite();

            suite.register = sinon.stub();
            suite.handle = sinon.stub().returns('foobar');
            suite.finish = sinon.stub();
            suite.cleanUp = sinon.stub();

            var value = await suite.boot();

            assert.equal(value, 'foobar');

            assert.ok(suite.register.calledBefore(suite.handle), 'the register method should be called before handle.');
            assert.ok(suite.handle.calledBefore(suite.finish), 'the handle method should be called before finish.');
            assert.ok(suite.finish.calledBefore(suite.cleanUp), 'the finish method should be called before cleanUp.');
            assert.ok(suite.cleanUp.called, 'the cleanUp method should be called.');
        });

        it('should still call the clean up method when an exception throws while registing.', async () => {
            var suite = new Suite();

            suite.register = sinon.stub().throws();
            suite.cleanUp = sinon.stub();

            await assert.isRejected(suite.boot());

            assert.ok(suite.cleanUp.called, 'the cleanUp method should still be called.');
        });

        it('should still call the clean up method when an exception throws while handling.', async () => {
            var suite = new Suite();

            suite.handle = sinon.stub().throws();
            suite.cleanUp = sinon.stub();

            await assert.isRejected(suite.boot());

            assert.ok(suite.cleanUp.called, 'the cleanUp method should still be called.');
        });
    });
});
