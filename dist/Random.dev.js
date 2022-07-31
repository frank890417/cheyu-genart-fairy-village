"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var projectNumber = Math.floor(parseInt(tokenData.tokenId) / 1000000);
var mintNumber = parseInt(tokenData.tokenId) % (projectNumber * 1000000);
var seed = parseInt(tokenData.hash.slice(0, 16), 16);

var Random =
/*#__PURE__*/
function () {
  function Random() {
    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    _classCallCheck(this, Random);

    this.seed = seed;
  }

  _createClass(Random, [{
    key: "random",
    value: function random() {
      return this.random_dec();
    }
  }, {
    key: "random_dec",
    value: function random_dec() {
      //  return hashRand();

      /* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
      this.seed ^= this.seed << 13;
      this.seed ^= this.seed >> 17;
      this.seed ^= this.seed << 5;
      return (this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000 / 1000;
    }
  }, {
    key: "random_num",
    value: function random_num(a, b) {
      if (b === undefined) {
        b = a;
        a = 0;
      }

      return a + (b - a) * this.random_dec();
    }
  }, {
    key: "random_int",
    value: function random_int(a, b) {
      if (b === undefined) {
        b = a;
        a = 0;
      }

      return Math.floor(this.random_num(a, b + 1));
    }
  }, {
    key: "random_bool",
    value: function random_bool(p) {
      return this.random_dec() < p;
    }
  }, {
    key: "random_choice",
    value: function random_choice(list) {
      return list[Math.floor(this.random_num(0, list.length * 0.99))];
    }
  }, {
    key: "random_choice_weight",
    value: function random_choice_weight(obj) {
      var sum = Object.values(obj).reduce(function (a, b) {
        return a + b;
      }, 0);
      var steps = Object.values(obj).reduce(function (arr, num) {
        arr.push((arr.slice(-1) || 0) * 1 + num);
        return arr;
      }, [0]);
      var ran = this.random_num(0, sum);
      var result = 0;

      for (var i = steps.length - 1; i >= 1; i--) {
        result = i - 1;

        if (ran > steps[i - 1] && ran < steps[i]) {
          break;
        }
      }

      return Object.keys(obj)[result];
    }
  }]);

  return Random;
}();

var R = new Random(seed);

var random = function random(obj, obj2) {
  //random()
  if (obj == undefined) {
    return R.random_dec();
  } //random([1,2,3])


  if (Array.isArray(obj)) {
    return R.random_choice(obj);
  } //random(50)


  if (typeof obj == 'number' && typeof obj2 == 'number') {
    return R.random_num(obj, obj2);
  } //random(50)


  if (typeof obj == 'number' && obj2 == undefined) {
    return R.random_num(0, obj);
  }

  if (_typeof(obj) == 'object') {
    return R.random_choice_weight(obj);
  }
};