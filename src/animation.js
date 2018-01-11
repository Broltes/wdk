let lastTime = 0;
const rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
  function (callback) {
    const currTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeToCall;

    const id = setTimeout(() => {
      callback(lastTime);
    }, timeToCall);
    return id;
  };
// const cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout;

const running = {};
let counter = 1;

export default {
  start(stepCallback, duration, easingMethod) {
    let percent = 0;
    const start = Date.now();
    const id = counter;
    counter += 1;

    // This is the internal step method which is called every few milliseconds
    function step() {
      const now = Date.now();

      // Compute percent value
      if (duration) {
        percent = (now - start) / duration;
        if (percent > 1) {
          percent = 1;
        }
      }

      if (running[id]) {
        const easedPercent = easingMethod ? easingMethod(percent) : percent;
        if (stepCallback(easedPercent) === false || percent === 1) {
          // Stop animation
          running[id] = null;
        } else {
          // Step to next
          rAF(step);
        }
      }
    }

    // Mark as running
    running[id] = true;
    rAF(step);
    return id;
  },
  // Stops the given animation.
  stop(id) {
    running[id] = null;
  },

  easeOutCubic(pos) {
    return ((pos - 1) ** 3) + 1;
  },
  easeInOutCubic(pos) {
    const nextPos = pos / 0.5;
    if (nextPos < 1) {
      return 0.5 * (nextPos ** 3);
    }

    return 0.5 * (((nextPos - 2) ** 3) + 2);
  },
};
