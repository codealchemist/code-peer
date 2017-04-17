import SimplePeer from 'simple-peer'
import io from 'socket.io-client'

export default class Peer {
  constructor ({server = 'http://localhost:7331', documentId = null} = {}) {
    this.eventHandlers = {}
    this.server = server
    this.documentId = documentId
    console.log('-- socket server: ', server)
    console.log('-- document id: ', documentId)
  }

  init () {
    console.log('-- init Peer')
    this.socket = io(this.server)
    this.setEvents()
  }

  setEvents () {
    this.socket.on('connected', (data) => this.onConnection(data))
    this.socket.on('disconnect', (data) => this.onDisconnect(data))
    this.socket.on('created', (data) => this.onCreated(data))
    this.socket.on('joined', (data) => this.onJoined(data))
    this.socket.on('documentChanged', (data) => this.onDocumentChanged(data))
    this.socket.on('newPeer', (data) => this.onNewPeer(data))
  }

  onConnection (data) {
    console.log('-- socket connected', data)

    // Connect to existing document.
    if (this.documentId) {
      console.log('-- emit join')
      this.socket.emit('join', this.documentId)
      return
    }

    // Create new document.
    console.log('-- emit create')
    this.socket.emit('create', {}, (data) => {
      console.log('-- create sent ok')
    })
  }

  onDisconnect (data) {
    console.log('-- socket disconnected', data)
  }

  onCreated (id) {
    console.log('-- socket: created document:', id)
    this.fire('created', id)
  }

  onJoined (id) {
    console.log('-- socket: joined document:', id)
    this.fire('joined', id)
  }

  onNewPeer (data) {
    console.log('-- socket: new peer:', data)
    this.fire('newPeer', data)
  }

  onDocumentChanged ({id, data}) {
    console.log(`-- socket: document ${id} changed:`, data)
    this.fire('documentChanged', data)
  }

  onPeer () {
    this.peer = new SimplePeer()
  }

  on (eventName, callback) {
    this.eventHandlers[eventName] = this.eventHandlers[eventName] || []
    this.eventHandlers[eventName].push(callback)
  }

  off (eventName, callback) {
    this.eventHandlers.some((currentCallback, index) => {
      if (currentCallback === callback) {
        this.eventHandlers[eventName].splice(index, 1)
        return true
      }
    })
  }

  fire (eventName, data) {
    const handlers = this.eventHandlers[eventName]
    if (!handlers || !handlers.length) return

    handlers.map((handler) => {
      handler(data)
    })
  }

  change (data) {
    this.socket.emit('documentChange', {id: this.documentId, data})
    this.fire('onDocumentChange', data)
  }
}
