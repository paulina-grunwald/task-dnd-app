import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
`

export default class Tasks extends React.Component {
  render () {
    return (
      <Container>
        {this.props.task.content}
      </Container>)
  }
}
