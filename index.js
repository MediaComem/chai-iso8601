const moment = require('moment');

const COMPARISONS = {
  eq: "eq",
  gt: "greater than",
  gte: "greater than or equal",
  lt: "less than",
  lte: "less than or equal"
}

module.exports = function(options) {
  options = options || {};

  const marginRequired = options.marginRequired !== undefined ? !!options.marginRequired : false;

  return function(chai, utils) {
    chai.Assertion.addMethod('iso8601', function(comparison, value, margin) {
      if (comparison !== undefined && !COMPARISONS[comparison] && (value === undefined || typeof(value) == 'number') && margin === undefined) {
        margin = value;
        value = comparison;
        comparison = 'eq';
      }

      if (margin === undefined && marginRequired) {
        throw new Error(`The "margin" option must be specified`);
      } else if (margin === undefined) {
        margin = 0;
      } else if (typeof(margin) != 'number' || margin < 0) {
        throw new Error(`The "margin" option must be undefined, false, zero or a positive integer, got ${margin} (type ${typeof(margin)})`);
      }

      const obj = utils.flag(this, 'object');
      this.assert(typeof(obj) == 'string', 'expected #{this} to be a valid ISO-8601 date string', 'expected #{this} not to be a valid ISO-8601 date string');

      const actualDate = moment(obj, moment.ISO_8601);
      this.assert(actualDate.isValid(), 'expected #{this} to be a valid ISO-8601 date string', 'expected #{this} not to be a valid ISO-8601 date string');

      const expectedDate = moment(value, moment.ISO_8601);
      if (!expectedDate.isValid()) {
        throw new Error(`Expected date "${value}" is not a valid ISO-8601 date`);
      }

      if (comparison == 'eq') {
        if (!margin) {
          const message = `expected ${actualDate.utc().format()} to be the same as ${expectedDate.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.equal(expectedDate.valueOf());
        } else {

          const lowerBound = moment(expectedDate).subtract(margin, 'milliseconds');
          const upperBound = moment(expectedDate).add(margin, 'milliseconds');
          const message = `expected ${actualDate.utc().format()} to be between ${lowerBound.utc().format()} and ${upperBound.utc().format()}`;

          new chai.Assertion(actualDate.valueOf(), message).to.be.gte(lowerBound.valueOf());
          new chai.Assertion(actualDate.valueOf(), message).to.be.lte(upperBound.valueOf());
        }
      } else if (comparison == 'gt') {
        if (!margin) {
          const message = `expected ${actualDate.utc().format()} to be after ${expectedDate.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.gt(expectedDate.valueOf());
        } else {
          const upperBound = moment(expectedDate).add(margin, 'milliseconds');
          const message = `expected ${actualDate.utc().format()} to be after ${expectedDate.utc().format()} but before or the same as ${upperBound.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.gt(expectedDate.valueOf());
          new chai.Assertion(actualDate.valueOf(), message).to.be.lte(upperBound.valueOf());
        }
      } else if (comparison == 'gte') {
        if (!margin) {
          const message = `expected ${actualDate.utc().format()} to be after or the same as ${expectedDate.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.gte(expectedDate.valueOf());
        } else {
          const upperBound = moment(expectedDate).add(margin, 'milliseconds');
          const message = `expected ${actualDate.utc().format()} to be after or the same as ${expectedDate.utc().format()} but before or the same as ${upperBound.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.gte(expectedDate.valueOf());
          new chai.Assertion(actualDate.valueOf(), message).to.be.lte(upperBound.valueOf());
        }
      } else if (comparison == 'lt') {
        if (!margin) {
          const message = `expected ${actualDate.utc().format()} to be before ${expectedDate.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.lt(expectedDate.valueOf());
        } else {
          const lowerBound = moment(expectedDate).subtract(margin, 'milliseconds');
          const message = `expected ${actualDate.utc().format()} to be before ${expectedDate.utc().format()} but after or the same as ${lowerBound.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.lt(expectedDate.valueOf());
          new chai.Assertion(actualDate.valueOf(), message).to.be.gte(lowerBound.valueOf());
        }
      } else if (comparison == 'lte') {
        if (!margin) {
          const message = `expected ${actualDate.utc().format()} to be before or the same as ${expectedDate.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.lte(expectedDate.valueOf());
        } else {
          const lowerBound = moment(expectedDate).subtract(margin, 'milliseconds');
          const message = `expected ${actualDate.utc().format()} to be before or the same as ${expectedDate.utc().format()} but after or the same as ${lowerBound.utc().format()}`;
          new chai.Assertion(actualDate.valueOf(), message).to.be.lte(expectedDate.valueOf());
          new chai.Assertion(actualDate.valueOf(), message).to.be.gte(lowerBound.valueOf());
        }
      } else {

        const descriptions = [];
        for (let operator in COMPARISONS) {
          const description = COMPARISONS[operator];
          descriptions.push(`"${operator}"${description != operator ? ' (' + description + ')' : ''}`);
        }

        throw new Error(`The "comparison" argument must be one of ${descriptions.join(', ')}; got ${JSON.stringify(comparison)}`);
      }
    });
  };
};
