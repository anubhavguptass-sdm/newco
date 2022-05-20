window.BPIntervals = [];
const Interval = function(func, interval, args, once) {
  window._focused = true;
  let pauseMemory;
  this.remaining = interval;
  this.id = `Interval${new Date().getTime()}`;
  this.visible = true;
  this.resumed = false;
  this.elapsed = 0;
  this.paused = false;
  this._pausedOn = 0;
  this._resumedOn = 0;
  this._pausedFor = 0;
  this.once = once ? once : false;
  this.onUpdate = () => {};
  this._private_interval = timestamp => {
    if (this.elapsed < interval) {
      if (typeof this.started === 'undefined') {
        this.started = timestamp;
      }
      this.elapsed = timestamp - this._pausedFor - this.started;
      this.remaining = interval - this.elapsed;
      this.resumed = false;
      this.visible = true;
    } else {
      if (this.once) {
        let localArgs = [this.started];
        let tArguments = Array.isArray(args)
          ? [...localArgs, ...args]
          : localArgs;
        if (typeof func === 'function') func.apply(this, tArguments);
        window._Intervals[this.id] = null;
        delete window._Intervals[this.id];
        return;
      }
      this.oldTimeStamp = 0;
      this._pausedFor = 0;
      this._resumedOn = 0;
      this._pausedOn = 0;
      this.remaining = interval;
      this.started = timestamp;
      this.estimatedEnd = this.started + interval;
      this.elapsed = 0;
      let localArgs = [this.started];
      let tArguments = Array.isArray(args)
        ? [...localArgs, ...args]
        : localArgs;
      if (typeof func === 'function') func.apply(this, tArguments);
    }
    if (!this.paused || !this.visible) {
      if (typeof this.onUpdate === 'function')
        this.onUpdate({
          remaining: this.remaining,
          visible: this.visible,
          resumed: this.resumed,
          elapsed: this.elapsed,
          paused: this.paused,
          interval: interval
        });
      window.requestAnimationFrame(this._private_interval);
    }
  };
  window.requestAnimationFrame(this._private_interval);
  window.BPIntervals = Array.isArray(window.BPIntervals)
    ? [...window.BPIntervals, ...[this]]
    : [this];

  if (typeof window._Intervals !== 'object') {
    window._Intervals = {};
  }

  window._Intervals[this.id] = this;

  return this;
};

Interval.prototype.pause = function() {
  this._pausedOn = new Date().getTime();
  this.paused = true;
};

Interval.prototype.resume = function() {
  this._resumedOn = new Date().getTime();
  this._pausedFor += this._resumedOn - this._pausedOn;
  this.paused = false;
  this.resumed = true;
  window.requestAnimationFrame(this._private_interval);
};

window.addEventListener('focus', () => {
  try {
    window._focused = true;
    window.BPIntervals.forEach((el, ind) => {
      el.visible = true;
      el.resume();
    });
  } catch (err) {}
});
window.addEventListener('blur', () => {
  try {
    window._focused = false;
    window.BPIntervals.forEach((el, ind) => {
      el.visible = false;
      el.pause();
    });
  } catch (err) {}
});
