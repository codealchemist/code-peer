import React from 'react'
import Head from 'next/head'

export default class Editor extends React.Component {
  constructor (props) {
    super()
    this.storeKey = 'code'
    this.props = props
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
      setTimeout(() => {
        const code = this.editor.getValue()
        if (!this.changed(code)) return

        console.log('-- editor: send peer change')
        this.save(code)
        this.props.peer.change(code)
      }, 100)
    })

    this.props.peer.on('documentChanged', (code) => {
      console.log('-- editor: documentChanged')
      this.save(code)
      this.editor.setValue(code)
    })
  }

  changed (code) {
    const savedCode = this.getSavedCode()
    return (savedCode != code)
  }

  getSavedCode () {
    return window.localStorage.getItem(this.storeKey)
  }

  save (code) {
    window.localStorage.setItem(this.storeKey, code)
  }

  load () {
    const code = this.getSavedCode()
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
