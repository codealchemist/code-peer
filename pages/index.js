import React from 'react'
import Head from 'next/head'
import Editor from '../components/editor'
import Peer from '../components/peer'

export default class Index extends React.Component {
  constructor (props) {
    super(props)
    this.title = 'Code Peer'

    const documentId = this.props.params.documentId
    const server = this.props.url.query.serverUrl
    this.peer = new Peer({server, documentId, props: this.props})
    this.peer.init()
  }

  static getInitialProps ({ req, res, jsonPageRes }) {
    const statusCode = res ? res.statusCode : (jsonPageRes ? jsonPageRes.status : null)
    const serverUrl = res ? res.serverUrl : (jsonPageRes ? jsonPageRes.serverUrl : null)
    return { statusCode, params: req.params, serverUrl }
  }

  componentDidMount () {
    this.handlePeerEvents()
  }

  handlePeerEvents () {
    this.peer.on('created', (id) => this.onDocumentCreated(id))
    this.peer.on('joined', (id) => this.onDocumentJoined(id))
  }

  onDocumentCreated (id) {
    console.log('--- index: onDocumentCreated: ', id)

    // Display proper URL for current document id without reloading.
    window.history.pushState({pageTitle: this.title}, '', `/document/${id}`)
  }

  onDocumentJoined (id) {
    console.log('--- index: onDocumentJoined: ', id)
  }

  render () {
    return (
      <div>
        <Head>
          <title>{this.title}</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>

        <Editor peer={this.peer} />
      </div>
    )
  }
}
