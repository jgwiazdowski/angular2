/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
var Set_1 = require('../util/Set');
function distinct(keySelector, flushes) {
  return this.lift(new DistinctOperator(keySelector, flushes));
}
exports.distinct = distinct;
var DistinctOperator = (function() {
  function DistinctOperator(keySelector, flushes) {
    this.keySelector = keySelector;
    this.flushes = flushes;
  }
  DistinctOperator.prototype.call = function(subscriber, source) {
    return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
  };
  return DistinctOperator;
}());
var DistinctSubscriber = (function(_super) {
  __extends(DistinctSubscriber, _super);
  function DistinctSubscriber(destination, keySelector, flushes) {
    _super.call(this, destination);
    this.keySelector = keySelector;
    this.values = new Set_1.Set();
    if (flushes) {
      this.add(subscribeToResult_1.subscribeToResult(this, flushes));
    }
  }
  DistinctSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.values.clear();
  };
  DistinctSubscriber.prototype.notifyError = function(error, innerSub) {
    this._error(error);
  };
  DistinctSubscriber.prototype._next = function(value) {
    if (this.keySelector) {
      this._useKeySelector(value);
    } else {
      this._finalizeNext(value, value);
    }
  };
  DistinctSubscriber.prototype._useKeySelector = function(value) {
    var key;
    var destination = this.destination;
    try {
      key = this.keySelector(value);
    } catch (err) {
      destination.error(err);
      return;
    }
    this._finalizeNext(key, value);
  };
  DistinctSubscriber.prototype._finalizeNext = function(key, value) {
    var values = this.values;
    if (!values.has(key)) {
      values.add(key);
      this.destination.next(value);
    }
  };
  return DistinctSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.DistinctSubscriber = DistinctSubscriber;
