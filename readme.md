# Crocess

[![npm](https://img.shields.io/npm/v/crocess.svg)](https://www.npmjs.com/package/crocess)
[![Travis](https://img.shields.io/travis/crocess/crocess.svg)](https://travis-ci.org/crocess/crocess)
[![license](https://img.shields.io/npm/l/crocess.svg)](https://www.npmjs.com/package/crocess)

Make your command-line programs be easily called by externals.

## Links
- [GitHub](https://github.com/crocess/crocess)
- [Documentation](https://github.com/crocess/crocess/wiki)

## Requirements

- Node.js >= 6.0.0

## Installation

    $ npm install crocess

# Quick Start

[Learn more about Application](https://github.com/crocess/crocess/wiki/Application)

##### Create an application instance and return data to console:

~~~js
var Application = require('crocess').Application;

new Application().boot(function () {
    console.log('Hello world!');

    return { 'foo': 'bar' };
});
~~~

You will see this on console:

~~~
Hello world!
>>>>>BEGIN_RESULT>>>>>{"foo":"bar"}
~~~

##### You can also return a Promise.

~~~js
new Application().boot(function () {
    return Promise.resolve({"foo":"bar"});
});

// or using 'async/await'.

new Application().boot(async function () {
    return await Promise.resolve({"foo":"bar"});
});

// => >>>>>BEGIN_RESULT>>>>>{"foo":"bar"}
~~~

#### Get Parameters

You can pass the parameters as a json formatted string with the `--parameters` argument.

~~~bash
node example.js --parameters='{"name":"World"}'
~~~

Example:

~~~js
new Application().boot(function () {
    return 'Hello ' + this.parameters.name;
});

// => >>>>>BEGIN_RESULT>>>>>Hello World
~~~

> The `parameters` property will be empty when the `--parameters` argument not given.

# Using Suite
[Learn more about Suites](https://github.com/crocess/crocess/wiki/Suites)

An example suite class:

~~~js
var Application = require('crocess').Application;
var BaseSuite = require('crocess').Suite;

class Example extends BaseSuite
{
    /**
     * Start handle the suite.
     */
    handle() {
        console.log('Hello suite!');

        return 'foobar';
    }
}
~~~

Now, boot the suite:

~~~js
new Application().boot(new Example);
~~~

You will see this on console:

~~~
Hello suite!
>>>>>BEGIN_RESULT>>>>>foobar
~~~

Another way to boot suites:

~~~js
new Application().boot(function () {
    return new Example().boot(this);
});
~~~

If you need to passing something to the suite, a very straightforward way is override the constructor:

~~~js
class Example extends BaseSuite
{
    constructor(foo) {
        super();

        this.foo = foo;
    }
}
~~~
