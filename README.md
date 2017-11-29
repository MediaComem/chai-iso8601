# chai-iso8601

[Chai](http://chaijs.com) assertion to check dates in the ISO-8601 format.

[![npm version](https://badge.fury.io/js/chai-iso8601.svg)](https://badge.fury.io/js/chai-iso8601)
[![Dependency Status](https://gemnasium.com/badges/github.com/MediaComem/chai-iso8601.svg)](https://gemnasium.com/github.com/MediaComem/chai-iso8601)
[![Build Status](https://travis-ci.org/MediaComem/chai-iso8601.svg?branch=master)](https://travis-ci.org/MediaComem/chai-iso8601)
[![Coverage Status](https://coveralls.io/repos/github/MediaComem/chai-iso8601/badge.svg?branch=master)](https://coveralls.io/github/MediaComem/chai-iso8601?branch=master)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [Operators](#operators)
  - [Margin of error](#margin-of-error)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Developed at the [Media Engineering Institute](http://mei.heig-vd.ch) ([HEIG-VD](https://heig-vd.ch)).



## Installation

```bash
$> npm install --save-dev chai-iso8601
```



## Usage

Basic usage allows you to check that a string is a valid ISO-8601 date and represents the expected time.

```js
const chai = require('chai');

// Note the extra call (chai-iso8601 returns a factory function).
chai.use(require('chai-iso8601')());

// Simple usage
const expectedDateString = '2001-01-01T00:00:00Z';
chai.expect('2001-01-01T00:00:00Z').to.be.iso8601(expectedDateString);

// With a date object
const expectedDate = new Date(2001, 0, 1, 0, 0, 0, 0);
chai.expect('2001-01-01T00:00:00Z').to.be.iso8601(expectedDate);

// With a moment object
const expectedMoment = require('moment')('2001-01-01T00:00:00Z');
chai.expect('2001-01-01T00:00:00Z').to.be.iso8601(expectedMoment);
```

### Operators

**chai-iso8601** includes operators to perform more complex assertions on dates.
All the following assertions will pass:

```js
// Check that a string is an ISO-8601 date that is equal to another date (this is the default operator used above).
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z');

// Check that a string is an ISO-8601 date that is after another date (and not the same).
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-12-31T23:59:00Z');

// Check that a string is an ISO-8601 date that is after or the same as another date.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z');
chai.expect('2001-01-01T00:00:00Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z');

// Check that a string is an ISO-8601 date that is before another date (and not the same).
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('lt', '2001-01-01T00:00:00Z');

// Check that a string is an ISO-8601 date that is before or the same as another date.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z');
chai.expect('1999-01-01T00:00:00Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z');
```

### Margin of error

You may pass an additional number representing a margin of error that the date must be within.
This can be useful in tests if you know the approximate value of a date but not its exact value.

Using a margin changes the behavior of the operators. All the following assertions will pass:

```js
// Check that a string is an ISO-8601 date that is equal to another date with a margin of one second.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1000);
chai.expect('1999-12-31T23:59:59Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1000);
chai.expect('2000-01-01T00:00:01Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1000);

// Check that a string is an ISO-8601 date that is after another date but no more than one second.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-12-31T23:59:59Z', 1000);
chai.expect('1999-12-31T23:59:59.666Z').to.be.iso8601('gt', '1999-12-31T23:59:59Z', 1000);

// Check that a string is an ISO-8601 date that is after or the same as another date but no more than one second.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1000);
chai.expect('2000-01-01T00:00:01Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1000);

// Check that a string is an ISO-8601 date that is before another date but no more than one second.
chai.expect('1999-12-31T29:59:59Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z');
chai.expect('1999-12-31T29:59:59.666Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z');

// Check that a string is an ISO-8601 date that is before or the same as another date but no more than one second.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1000);
chai.expect('1999-12-31T23:59:59.666Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1000);
```

Note that the following assertions **WILL NOT PASS** although they would without a margin of error:

```js
// The date is after the specified one, but it exceeds the margin of error of 500 milliseconds.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-12-31T23:59:59Z', 500);
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '1999-12-31T23:59:59Z', 500);

// The date is before the specified one, but it exceeds the margin of error of 500 milliseconds.
chai.expect('1999-12-31T29:59:59Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 500);
chai.expect('1999-12-31T29:59:59Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 500);
```

If you are using a margin of error in your tests, you might want to make it **mandatory**
so that it throws an error if you forget to specify one.

```js
const chai = require('chai');

// Note the extra call (chai-iso8601 returns a factory function).
chai.use(require('chai-iso8601')({
  marginRequired: true
}));

// Error thrown! (margin is missing)
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-12-31T23:59:59Z');

// No error thrown
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-12-31T23:59:59Z', 1000);

// Use a margin of zero if you don't need a margin for that particular test.
chai.expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-12-31T23:59:59Z', 0);
```
