/* istanbul ignore file */
const chai = require('chai');
const moment = require('moment');

const chaiIso8601 = require('../');

const expect = chai.expect;
const INVALID_ISO8601_DATE = '#Ç}|{]}';

describe('chai-iso8601', () => {
  beforeEach(() => {
    chai.use(chaiIso8601());
  });

  it('should validate an exact ISO-8601 date string', () => {
    expect('2000-01-01T00:00:00Z').to.be.iso8601('2000-01-01T00:00:00Z');
  });

  it('should validate an exact ISO-8601 date string with a date object', () => {
    expect('2000-01-01T00:00:00Z').to.be.iso8601(moment('2000-01-01T00:00:00Z').toDate());
  });

  it('should validate an exact ISO-8601 date string with a moment object', () => {
    expect('2000-01-01T00:00:00Z').to.be.iso8601(moment('2000-01-01T00:00:00Z'));
  });

  it('should fail to validate an invalid ISO-8601 date string', () => {
    expect(() => {
      expect(INVALID_ISO8601_DATE).to.be.iso8601('2000-01-01T00:00:00');
    }).to.throw(`expected '${INVALID_ISO8601_DATE}' to be a valid ISO-8601 date string`);
  });

  it('should not accept an invalid ISO-8601 date string as the expected date', () => {
    expect(() => {
      expect('2000-01-01T00:00:00Z').to.be.iso8601(INVALID_ISO8601_DATE);
    }).to.throw(`Expected date "${INVALID_ISO8601_DATE}" is not a valid ISO-8601 date`);
  });

  it('should not accept an invalid operator', () => {
    expect(() => {
      expect('2000-01-01T00:00:00Z').to.be.iso8601('foo', '2000-01-01T00:00:00Z');
    }).to.throw('The "comparison" argument must be one of "eq", "gt" (greater than), "gte" (greater than or equal), "lt" (less than), "lte" (less than or equal); got "foo"');
  });

  it('should not accept an invalid margin', () => {
    expect(() => {
      expect('2000-01-01T00:00:00Z').to.be.iso8601('2000-01-01T00:00:00Z', -123);
    }).to.throw('The "margin" option must be undefined, false, zero or a positive integer, got -123 (type number)');
  });

  describe('operators', () => {
    describe('eq', () => {
      it('should validate a date that is the same as the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z');
      });

      it('should not validate a date that is after the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('eq', '1999-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be the same as 1999-01-01T00:00:00Z: expected 946684800000 to equal 915148800000');
      });

      it('should not validate a date that is before the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('eq', '2001-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be the same as 2001-01-01T00:00:00Z: expected 946684800000 to equal 978307200000');
      });

      describe('with a margin', () => {
        it('should validate a date that is the same as the expected date', () => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
        });

        it('should validate a date that is after the expected date within the margin of error', () => {
          expect('2000-01-01T00:00:01Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
          expect('2000-01-01T00:00:01.234Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
        });

        it('should validate a date that is before the expected date within the margin of error', () => {
          expect('1999-12-31T23:59:59Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
          expect('1999-12-31T23:59:58.766Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
        });

        it('should not validate a date that is after the expected date and outside the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01.235Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be between 1999-12-31T23:59:58Z and 2000-01-01T00:00:01Z: expected 946684801235 to be at most 946684801234');
        });

        it('should not validate a date that is before the expected date and outside the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:58.765Z').to.be.iso8601('eq', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be between 1999-12-31T23:59:58Z and 2000-01-01T00:00:01Z: expected 946684798765 to be at least 946684798766');
        });
      });
    });

    describe('gt', () => {
      it('should validate a date that is after the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '1999-01-01T00:00:00Z');
      });

      it('should not validate a date that is before the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '2001-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be after 2001-01-01T00:00:00Z: expected 946684800000 to be above 978307200000');
      });

      it('should not validate a date that is the same as the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be after 2000-01-01T00:00:00Z: expected 946684800000 to be above 946684800000');
      });

      describe('with a margin', () => {
        it('should not validate a date that is the same as the expected date', () => {
          expect(() => {
            expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:00Z to be after 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684800000 to be above 946684800000');
        });

        it('should validate a date that is after the expected date within the margin of error', () => {
          expect('2000-01-01T00:00:01Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
          expect('2000-01-01T00:00:01.234Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
        });

        it('should not validate a date that is before the expected date within the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:59Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:59Z to be after 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684799000 to be above 946684800000');

          expect(() => {
            expect('1999-12-31T23:59:58.766Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be after 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684798766 to be above 946684800000');
        });

        it('should not validate a date that is after the expected date and outside the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01.235Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be after 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684801235 to be at most 946684801234');
        });

        it('should not validate a date that is before the expected date and outside the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:58.765Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be after 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684798765 to be above 946684800000');
        });
      });
    });

    describe('gte', () => {
      it('should validate a date that is after the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '1999-01-01T00:00:00Z');
      });

      it('should validate a date that is the same as the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z');
      });

      it('should not validate a date that is before the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '2001-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be after or the same as 2001-01-01T00:00:00Z: expected 946684800000 to be at least 978307200000');
      });

      describe('with a margin', () => {
        it('should validate a date that is the same as the expected date', () => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
        });

        it('should validate a date that is after the expected date within the margin of error', () => {
          expect('2000-01-01T00:00:01Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
          expect('2000-01-01T00:00:01.234Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
        });

        it('should not validate a date that is before the expected date within the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:59Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:59Z to be after or the same as 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684799000 to be at least 946684800000');

          expect(() => {
            expect('1999-12-31T23:59:58.766Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be after or the same as 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684798766 to be at least 946684800000');
        });

        it('should not validate a date that is after the expected date and outside the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01.235Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be after or the same as 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684801235 to be at most 946684801234');
        });

        it('should not validate a date that is before the expected date and outside the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:58.765Z').to.be.iso8601('gte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be after or the same as 2000-01-01T00:00:00Z but before or the same as 2000-01-01T00:00:01Z: expected 946684798765 to be at least 946684800000');
        });
      });
    });

    describe('lt', () => {
      it('should validate a date that is before the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('lt', '2001-01-01T00:00:00Z');
      });

      it('should not validate a date that is after the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('lt', '1999-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be before 1999-01-01T00:00:00Z: expected 946684800000 to be below 915148800000');
      });

      it('should not validate a date that is the same as the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be before 2000-01-01T00:00:00Z: expected 946684800000 to be below 946684800000');
      });

      describe('with a margin', () => {
        it('should not validate a date that is the same as the expected date', () => {
          expect(() => {
            expect('2000-01-01T00:00:00Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:00Z to be before 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684800000 to be below 946684800000');
        });

        it('should validate a date that is before the expected date within the margin of error', () => {
          expect('1999-12-31T23:59:59Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
          expect('1999-12-31T23:59:58.766Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
        });

        it('should not validate a date that is after the expected date within the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be before 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684801000 to be below 946684800000');

          expect(() => {
            expect('2000-01-01T00:00:01.234Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be before 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684801234 to be below 946684800000');
        });

        it('should not validate a date that is after the expected date and outside the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01.235Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be before 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684801235 to be below 946684800000');
        });

        it('should not validate a date that is before the expected date and outside the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:58.765Z').to.be.iso8601('lt', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be before 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684798765 to be at least 946684798766');
        });
      });
    });

    describe('lte', () => {
      it('should validate a date that is before the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('lte', '2001-01-01T00:00:00Z');
      });

      it('should validate a date that is the same as the expected date', () => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z');
      });

      it('should not validate a date that is after the expected date', () => {
        expect(() => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('lte', '1999-01-01T00:00:00Z');
        }).to.throw('expected 2000-01-01T00:00:00Z to be before or the same as 1999-01-01T00:00:00Z: expected 946684800000 to be at most 915148800000');
      });

      describe('with a margin', () => {
        it('should validate a date that is the same as the expected date', () => {
          expect('2000-01-01T00:00:00Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
        });

        it('should validate a date that is before the expected date within the margin of error', () => {
          expect('1999-12-31T23:59:59Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
          expect('1999-12-31T23:59:58.766Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
        });

        it('should not validate a date that is after the expected date within the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be before or the same as 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684801000 to be at most 946684800000');

          expect(() => {
            expect('2000-01-01T00:00:01.234Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be before or the same as 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684801234 to be at most 946684800000');
        });

        it('should not validate a date that is after the expected date and outside the margin of error', () => {
          expect(() => {
            expect('2000-01-01T00:00:01.235Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 2000-01-01T00:00:01Z to be before or the same as 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684801235 to be at most 946684800000');
        });

        it('should not validate a date that is before the expected date and outside the margin of error', () => {
          expect(() => {
            expect('1999-12-31T23:59:58.765Z').to.be.iso8601('lte', '2000-01-01T00:00:00Z', 1234);
          }).to.throw('expected 1999-12-31T23:59:58Z to be before or the same as 2000-01-01T00:00:00Z but after or the same as 1999-12-31T23:59:58Z: expected 946684798765 to be at least 946684798766');
        });
      });
    });
  });

  describe('"marginRequired" option', () => {
    beforeEach(() => {
      chai.use(chaiIso8601({
        marginRequired: true
      }));
    });

    it('should validate a date with a margin', () => {
      expect('2000-01-01T00:00:00Z').to.be.iso8601('2000-01-01T00:00:00Z', 0);
    });

    it('should validate a date with an operator and a margin', () => {
      expect('2000-01-01T00:00:01Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z', 1234);
    });

    it('should not validate a date without a margin', () => {
      expect(() => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('2000-01-01T00:00:00Z');
      }).to.throw('The "margin" option must be specified');
    });

    it('should not validate a date with an operator but without a margin', () => {
      expect(() => {
        expect('2000-01-01T00:00:00Z').to.be.iso8601('gt', '2000-01-01T00:00:00Z');
      }).to.throw('The "margin" option must be specified');
    });
  });
});
