import React from 'react'
import Head from 'next/head'

export default class Editor extends React.Component {
  constructor (props) {
    super()
    this.props = props
    this.cursor
    this.version = 0
  }

  onChange () {
    console.log('-- editor changed')
  }

  componentDidMount () {
    this.init()
  }

  init () {
    console.log('--- EDITOR: props:', this.props)
    this.editor = ace.edit('editor')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.getSession().setMode('ace/mode/javascript')

    this.setEvents()
    this.load()
  }

  setEvents () {
    this.editor.getSession().on('change', (e) => {
      console.log(`-- editor: code changed, version ${this.version}`)

      setTimeout(() => {
        // Restore cursor.
        if (this.cursor) {
          this.editor.navigateTo(this.cursor.row, this.cursor.column)
          this.cursor = null
        }
      }, 16)

      setTimeout(() => {
        const code = this.editor.getValue()
        if (!this.changed(code)) return

        this.version++
        console.log(`-- editor: send peer change, version ${this.version}`)
        this.save(code)
        this.props.peer.change({code, version: this.version})
      }, 100)
    })

    this.props.peer.on('documentChanged', ({code, version}) => {
      console.log(`-- editor: documentChanged, version: ${version}`)
      this.save({code, version})
      this.cursor = this.editor.selection.getCursor()
      if (version < this.version) return
      this.version = version

      // Update editor with new code.
      this.editor.setValue(code)
    })
  }

  changed (code) {
    const savedCode = this.getSavedCode()
    return (savedCode != code)
  }

  getSavedCode () {
    return window.localStorage.getItem('code')
  }

  getSavedVersion () {
    return window.localStorage.getItem('version')
  }

  save ({code, version}) {
    window.localStorage.setItem('code', code)
    window.localStorage.setItem('version', version)
  }

  load () {
    const code = this.getSavedCode()
    const version = this.getSavedVersion()
    this.version = version || 0

    if (!code) return
    this.editor.setValue(code)
  }

  render () {
    return (
      <div>
        <Head>
          <script src='//cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js' />
        </Head>

        <style jsx>{`
          #editor {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        `}</style>

        <div id='editor' />
      </div>
    )
  }
}
