const EventEmitter = {
  events: {},
  dispatch: function(event, data) {
    if (this.events[event]) {
      ;(this.events[event] || []).forEach(cb => cb(data))
    }
  },
  subscribe: function(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
}

export const events = {
  priceClicked: Symbol('priceClicked')
}

export default EventEmitter
