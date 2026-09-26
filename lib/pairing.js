/**
 * Holds the current pairing code / connection state so it can be
 * displayed on the web dashboard instead of only in scrolling logs.
 */

let state = {
  code: null,        // e.g. "RVA5KQQY"
  generatedAt: null, // ISO timestamp
  connected: false,
  phoneNumber: null,
};

function setCode(code, phoneNumber) {
  state.code = code;
  state.phoneNumber = phoneNumber;
  state.generatedAt = new Date().toISOString();
  state.connected = false;
}

function setConnected(connected) {
  state.connected = connected;
  if (connected) {
    // Code is no longer needed once linked
    state.code = null;
  }
}

function getState() {
  return { ...state };
}

module.exports = { setCode, setConnected, getState };
