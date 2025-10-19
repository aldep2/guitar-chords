import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){
    super(props)
    this.state = {error:null, info:null}
  }
  componentDidCatch(error, info){
    this.setState({error, info})
    // also log to console
    console.error('ErrorBoundary caught', error, info)
  }
  render(){
    if(this.state.error){
      return (
        <div style={{padding:20,fontFamily:'sans-serif'}}>
          <h2>Une erreur est survenue</h2>
          <pre style={{whiteSpace:'pre-wrap',color:'#900'}}>{String(this.state.error && this.state.error.message)}</pre>
          <details style={{whiteSpace:'pre-wrap'}}>
            <summary>Stack / info</summary>
            <pre>{this.state.info && this.state.info.componentStack}</pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
