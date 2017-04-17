import React from 'react'
import Head from 'next/head'

export default class Editor extends React.Component {
  constructor () {
    super()
    this.storeKey = 'code'
  }

  onChange () {
    console.log('-- editor changed')
  }

  componentDidMount () {
    this.init()
  }

  init () {
    this.editor = ace.edit('editor')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.getSession().setMode('ace/mode/javascript')

    this.setEvents()
    this.load()
  }

  setEvents () {
    this.editor.getSession().on('change', (e) => {
      const code = this.editor.getValue()
      this.save(code)
    })
  }

  save (code) {
    window.localStorage.setItem(this.storeKey, code)
  }

  load () {
    const code = window.localStorage.getItem(this.storeKey)
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
