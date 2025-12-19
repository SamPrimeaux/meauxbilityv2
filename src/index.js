var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), {
  bigint: /* @__PURE__ */ __name(function bigint() {
    return BigInt(Date.now() * 1e6);
  }, "bigint")
});

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../../.nvm/versions/node/v24.11.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.ts
var index_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (path === "/" || path === "/dashboard" || path === "/dashboard/apps") {
      return serveDashboard(env2, corsHeaders);
    }
    if (path === "/talk") return serveR2Page("meauxtalk.html", env2, corsHeaders);
    if (path === "/board") return serveR2Page("meauxboard.html", env2, corsHeaders);
    if (path === "/docs") return serveR2Page("meauxdocs.html", env2, corsHeaders);
    if (path === "/photo") return serveR2Page("meauxphoto.html", env2, corsHeaders);
    if (path === "/design") return serveR2Page("meauxdesign.html", env2, corsHeaders);
    if (path === "/cloud") return serveR2Page("meauxcloud.html", env2, corsHeaders);
    if (path === "/mail") return serveR2Page("meauxmail.html", env2, corsHeaders);
    if (path === "/calendar") return serveR2Page("meauxcalendar.html", env2, corsHeaders);
    if (path === "/wallet") return serveR2Page("meauxwallet.html", env2, corsHeaders);
    if (path === "/community") return serveR2Page("community.html", env2, corsHeaders);

    if (path === "/dashboard/dev/sql") {
      return serveSQLEditor(env2, corsHeaders);
    }
    if (path.startsWith("/api/")) {
      return handleAPI(request, env2, corsHeaders);
    }
    if (path.startsWith("/assets/")) {
      return serveAsset(path, env2.R2_STORAGE, corsHeaders);
    }
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
async function serveR2Page(fileName, env2, corsHeaders) {
  try {
    const object = await env2.R2_STORAGE.get(fileName);
    if (object) {
      const html = await object.text();
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
      });
    }
  } catch (e) {
    console.error(`Error loading ${fileName} from R2:`, e);
  }
  return new Response(`<h1>${fileName} loading...</h1><p>Please refresh</p>`, {
    headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
  });
}
__name(serveR2Page, "serveR2Page");

async function serveDashboard(env2, corsHeaders) {
  try {
    const object = await env2.R2_STORAGE.get("dashboard.html");
    if (object) {
      const html = await object.text();
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
      });
    }
  } catch (e) {
    console.error("Error loading dashboard from R2:", e);
  }
  return new Response("<h1>Dashboard loading...</h1><p>Please refresh</p>", {
    headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
  });
}
__name(serveDashboard, "serveDashboard");
async function serveSQLEditor(env2, corsHeaders) {
  try {
    const object = await env2.R2_STORAGE.get("sql-editor.html");
    if (object) {
      const html = await object.text();
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
      });
    }
  } catch (e) {
    console.error("Error loading SQL editor from R2:", e);
  }
  return new Response("<h1>SQL Editor loading...</h1><p>Please refresh</p>", {
    headers: { ...corsHeaders, "Content-Type": "text/html;charset=UTF-8" }
  });
}
__name(serveSQLEditor, "serveSQLEditor");
async function handleAPI(request, env2, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  try {
    if (path === "/api/projects") {
      if (request.method === "GET") return getProjects(env2, corsHeaders);
      if (request.method === "POST") return createProject(request, env2, corsHeaders);
    }
    if (path.startsWith("/api/projects/")) {
      const projectId = path.split("/")[3];
      if (request.method === "GET") return getProject(projectId, env2, corsHeaders);
      if (request.method === "PUT") return updateProject(projectId, request, env2, corsHeaders);
      if (request.method === "DELETE") return deleteProject(projectId, env2, corsHeaders);
    }
    if (path === "/api/meta-tags") {
      if (request.method === "GET") return getMetaTags(env2, corsHeaders, url.searchParams.get("project_id"));
      if (request.method === "POST") return createMetaTag(request, env2, corsHeaders);
    }
    if (path.startsWith("/api/meta-tags/")) {
      const tagId = path.split("/")[3];
      if (request.method === "PUT") return updateMetaTag(tagId, request, env2, corsHeaders);
      if (request.method === "DELETE") return deleteMetaTag(tagId, env2, corsHeaders);
    }
    if (path === "/api/validations") {
      if (request.method === "GET") return getValidations(env2, corsHeaders, url.searchParams.get("project_id"));
      if (request.method === "POST") return createValidation(request, env2, corsHeaders);
    }
    if (path === "/api/team") {
      if (request.method === "GET") return getTeam(env2, corsHeaders);
    }
    if (path === "/api/sql/query") {
      if (request.method === "POST") return executeSQLQuery(request, env2, corsHeaders);
    }
    if (path === "/api/sql/databases") {
      if (request.method === "GET") return getSQLDatabases(env2, corsHeaders);
    }
    if (path === "/api/workers") {
      if (request.method === "GET") return getWorkers(env2, corsHeaders);
    }
    if (path === "/api/github/repos") {
      if (request.method === "GET") return getGitHubRepos(env2, corsHeaders);
    }
    return jsonResponse({ error: "Not Found" }, 404, corsHeaders);
  } catch (error3) {
    return jsonResponse({ error: error3.message }, 500, corsHeaders);
  }
}
__name(handleAPI, "handleAPI");
async function getProjects(env2, corsHeaders) {
  const result = await env2.DB.prepare("SELECT * FROM projects ORDER BY updated_at DESC").all();
  return jsonResponse({ success: true, projects: result.results }, 200, corsHeaders);
}
__name(getProjects, "getProjects");
async function createProject(request, env2, corsHeaders) {
  const data = await request.json();
  const id = crypto.randomUUID();
  await env2.DB.prepare(
    `INSERT INTO projects(id, name, description, worker_name, worker_url, status, deployment_method, last_deployed, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    data.name,
    data.description || null,
    data.worker_name,
    data.worker_url,
    data.status || "active",
    data.deployment_method || null,
    data.last_deployed || null,
    data.created_by || null
  ).run();
  await logActivity(env2, id, "created", "Project created", data.created_by);
  return jsonResponse({ success: true, id }, 201, corsHeaders);
}
__name(createProject, "createProject");
async function getProject(projectId, env2, corsHeaders) {
  const result = await env2.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(projectId).first();
  if (!result) return jsonResponse({ error: "Project not found" }, 404, corsHeaders);
  return jsonResponse({ success: true, project: result }, 200, corsHeaders);
}
__name(getProject, "getProject");
async function updateProject(projectId, request, env2, corsHeaders) {
  const data = await request.json();
  await env2.DB.prepare(`UPDATE projects SET name = ?, description = ?, status = ?, updated_at = strftime('%s', 'now') WHERE id = ?`).bind(data.name, data.description || null, data.status || "active", projectId).run();
  await logActivity(env2, projectId, "updated", "Project updated", data.updated_by);
  return jsonResponse({ success: true }, 200, corsHeaders);
}
__name(updateProject, "updateProject");
async function deleteProject(projectId, env2, corsHeaders) {
  await env2.DB.prepare("DELETE FROM projects WHERE id = ?").bind(projectId).run();
  return jsonResponse({ success: true }, 200, corsHeaders);
}
__name(deleteProject, "deleteProject");
async function getMetaTags(env2, corsHeaders, projectId) {
  let query = "SELECT * FROM meta_tags WHERE is_active = 1";
  let params = [];
  if (projectId) {
    query += " AND project_id = ?";
    params.push(projectId);
  }
  query += " ORDER BY created_at DESC";
  const result = await env2.DB.prepare(query).bind(...params).all();
  return jsonResponse({ success: true, meta_tags: result.results }, 200, corsHeaders);
}
__name(getMetaTags, "getMetaTags");
async function createMetaTag(request, env2, corsHeaders) {
  const data = await request.json();
  const id = crypto.randomUUID();
  await env2.DB.prepare(`INSERT INTO meta_tags(id, project_id, tag_type, tag_name, tag_content, tag_attributes, created_by) VALUES(?, ?, ?, ?, ?, ?, ?)`).bind(id, data.project_id, data.tag_type, data.tag_name, data.tag_content, JSON.stringify(data.tag_attributes || {}), data.created_by || null).run();
  await logActivity(env2, data.project_id, "meta_tag_changed", "Meta tag added", data.created_by);
  return jsonResponse({ success: true, id }, 201, corsHeaders);
}
__name(createMetaTag, "createMetaTag");
async function updateMetaTag(tagId, request, env2, corsHeaders) {
  const data = await request.json();
  await env2.DB.prepare(`UPDATE meta_tags SET tag_content = ?, tag_attributes = ?, updated_at = strftime('%s', 'now') WHERE id = ?`).bind(data.tag_content, JSON.stringify(data.tag_attributes || {}), tagId).run();
  const tag = await env2.DB.prepare("SELECT project_id FROM meta_tags WHERE id = ?").bind(tagId).first();
  if (tag) await logActivity(env2, tag.project_id, "meta_tag_changed", "Meta tag updated", data.updated_by);
  return jsonResponse({ success: true }, 200, corsHeaders);
}
__name(updateMetaTag, "updateMetaTag");
async function deleteMetaTag(tagId, env2, corsHeaders) {
  await env2.DB.prepare("UPDATE meta_tags SET is_active = 0 WHERE id = ?").bind(tagId).run();
  return jsonResponse({ success: true }, 200, corsHeaders);
}
__name(deleteMetaTag, "deleteMetaTag");
async function getValidations(env2, corsHeaders, projectId) {
  let query = "SELECT * FROM project_validations";
  let params = [];
  if (projectId) {
    query += " WHERE project_id = ?";
    params.push(projectId);
  }
  query += " ORDER BY validated_at DESC";
  const result = await env2.DB.prepare(query).bind(...params).all();
  return jsonResponse({ success: true, validations: result.results }, 200, corsHeaders);
}
__name(getValidations, "getValidations");
async function createValidation(request, env2, corsHeaders) {
  const data = await request.json();
  const id = crypto.randomUUID();
  await env2.DB.prepare(`INSERT INTO project_validations(id, project_id, validation_type, status, message, details, validated_by) VALUES(?, ?, ?, ?, ?, ?, ?)`).bind(id, data.project_id, data.validation_type, data.status, data.message || null, JSON.stringify(data.details || {}), data.validated_by || null).run();
  await logActivity(env2, data.project_id, "validated", "Project validated", data.validated_by);
  return jsonResponse({ success: true, id }, 201, corsHeaders);
}
__name(createValidation, "createValidation");
async function getTeam(env2, corsHeaders) {
  const result = await env2.DB.prepare("SELECT * FROM team_members ORDER BY created_at DESC").all();
  return jsonResponse({ success: true, team: result.results }, 200, corsHeaders);
}
__name(getTeam, "getTeam");
async function getWorkers(env2, corsHeaders) {
  try {
    if (!env2.CLOUDFLARE_API_TOKEN || !env2.CLOUDFLARE_ACCOUNT_ID) {
      return jsonResponse({ success: false, error: "Cloudflare API credentials not configured" }, 503, corsHeaders);
    }
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env2.CLOUDFLARE_ACCOUNT_ID}/workers/scripts?per_page=1000`,
      {
        headers: {
          "Authorization": `Bearer ${env2.CLOUDFLARE_API_TOKEN}`
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse({ success: false, error: `Failed to list workers: ${errorText}` }, response.status, corsHeaders);
    }
    const data = await response.json();
    const workers = (data.result || []).map((w) => ({
      id: w.id,
      name: w.id,
      created_on: w.created_on,
      modified_on: w.modified_on,
      worker_url: `https://${w.id}.meauxbility.workers.dev`,
      preview_url: `https://${w.id}.meauxbility.workers.dev`
    }));
    const projects = await env2.DB.prepare("SELECT * FROM projects WHERE worker_name IS NOT NULL").all();
    const projectMap = /* @__PURE__ */ new Map();
    projects.results.forEach((p) => {
      projectMap.set(p.worker_name, p);
    });
    const enrichedWorkers = workers.map((w) => {
      const project = projectMap.get(w.name);
      return {
        ...w,
        project_id: project?.id,
        description: project?.description,
        status: project?.status || "active",
        tags: project?.tags ? JSON.parse(project.tags) : []
      };
    });
    return jsonResponse({ success: true, workers: enrichedWorkers }, 200, corsHeaders);
  } catch (error3) {
    return jsonResponse({ success: false, error: error3.message || "Failed to fetch workers" }, 500, corsHeaders);
  }
}
__name(getWorkers, "getWorkers");
async function getGitHubRepos(env2, corsHeaders) {
  try {
    const githubToken = env2.GITHUB_TOKEN;
    if (!githubToken) {
      return jsonResponse({ success: true, repos: [], count: 0, message: "GitHub token not configured" }, 200, corsHeaders);
    }
    const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "MeauxOS-Dashboard"
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse({ success: false, error: `Failed to fetch GitHub repos: ${errorText}` }, response.status, corsHeaders);
    }
    const repos = await response.json();
    const repoCount = Array.isArray(repos) ? repos.length : 0;
    return jsonResponse({ success: true, repos: repos || [], count: repoCount }, 200, corsHeaders);
  } catch (error3) {
    return jsonResponse({ success: false, error: error3.message || "Failed to fetch GitHub repositories" }, 500, corsHeaders);
  }
}
__name(getGitHubRepos, "getGitHubRepos");
async function getSQLDatabases(env2, corsHeaders) {
  const databases = [
    { id: "2a3a763a-92f1-4633-849e-268ddb31998f", name: "meaux-work-db", binding: "DB", description: "Primary dashboard database" },
    { id: "f01e1fbb-01fb-4900-80e9-bbb90db51bbe", name: "analytics-db", binding: "ANALYTICS_DB", description: "Analytics & tracking database" },
    { id: "ee3e3adb-da99-457d-8c2c-390ff19f6435", name: "user-data-db", binding: "USER_DB", description: "User & session data" },
    { id: "df192326-00b4-4d68-ad0d-5dd439dc8898", name: "secondary-db", binding: "SECONDARY_DB", description: "Secondary features database" }
  ];
  return jsonResponse({ success: true, databases }, 200, corsHeaders);
}
__name(getSQLDatabases, "getSQLDatabases");
async function executeSQLQuery(request, env2, corsHeaders) {
  try {
    const data = await request.json();
    const { query, database_id, read_only = false } = data;
    if (!query || !query.trim()) {
      return jsonResponse({ error: "Query is required" }, 400, corsHeaders);
    }
    const queryUpper = query.trim().toUpperCase();
    if (read_only) {
      const dangerousOps = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "CREATE", "TRUNCATE"];
      if (dangerousOps.some((op) => queryUpper.includes(op))) {
        return jsonResponse({ error: "Write operations are not allowed in read-only mode", allowed_ops: ["SELECT", "PRAGMA"] }, 403, corsHeaders);
      }
    }
    if (query.length > 1e4) {
      return jsonResponse({ error: "Query too long (max 10,000 characters)" }, 400, corsHeaders);
    }
    const db = env2.DB;
    const startTime = Date.now();
    let result;
    try {
      if (queryUpper.startsWith("SELECT") || queryUpper.startsWith("PRAGMA") || queryUpper.startsWith("EXPLAIN")) {
        result = await db.prepare(query).all();
      } else {
        if (read_only) return jsonResponse({ error: "Write operations not allowed in read-only mode" }, 403, corsHeaders);
        result = await db.prepare(query).run();
      }
      const executionTime = Date.now() - startTime;
      return jsonResponse({
        success: true,
        result: result.results || [],
        meta: result.meta || {},
        execution_time_ms: executionTime,
        row_count: result.results?.length || result.changes || 0
      }, 200, corsHeaders);
    } catch (dbError) {
      return jsonResponse({ success: false, error: dbError.message || "Database error", error_type: "database_error" }, 400, corsHeaders);
    }
  } catch (error3) {
    return jsonResponse({ success: false, error: error3.message || "Invalid request" }, 400, corsHeaders);
  }
}
__name(executeSQLQuery, "executeSQLQuery");
function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
async function logActivity(env2, projectId, activityType, description, userId) {
  const id = crypto.randomUUID();
  await env2.DB.prepare(`INSERT INTO project_activity(id, project_id, activity_type, description, user_id) VALUES(?, ?, ?, ?, ?)`).bind(id, projectId, activityType, description, userId || null).run();
}
__name(logActivity, "logActivity");
async function serveAsset(path, bucket, corsHeaders) {
  const key = path.replace("/assets/", "");
  const object = await bucket.get(key);
  if (!object) return new Response("Not Found", { status: 404, headers: corsHeaders });
  const headers = new Headers(corsHeaders);
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}
__name(serveAsset, "serveAsset");
class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request) {
    return new Response("ChatRoom Durable Object Live", {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
}
__name(ChatRoom, "ChatRoom");

export {
  index_default as default,
  ChatRoom
};
//# sourceMappingURL=index.js.map
