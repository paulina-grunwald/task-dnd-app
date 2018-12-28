import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import initialData from './initial-data';

const Container = styled.div`
  padding: 30px;
`

const ColumnsContainer = styled.div`
  display: flex;
`;

const Link = styled.a`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: lightblue;
  color: blue;
  border: 2px solid darkblue;
`;

class InnerList extends React.PureComponent {
  render () {
    const { column, taskMap, index } = this.props
    const tasks = column.taskIds.map(taskId => taskMap[taskId])

    return <Column column={column}
      tasks={tasks}
      index={index} />
  }
}

class App extends React.Component {
  state = initialData

  onDragStart = result => {
    // document.body.style.color = 'orange'
    // document.body.style.transition = 'background-color 0.2s ease'
    const homeIndex = this.state.columnOrder.indexOf(result.source.droppableId)
    this.setState({ homeIndex })
  }

  onDragUpdate = result => {
    // const { destination } = result;
    // const opacity = destination
    //   ? destination.index / Object.keys(this.state.tasks).length
    //   : 0;
    // document.body.style.backgroundColor = `rgba( 153, 141, 217, ${opacity})`;
  }

  onDragEnd = result => {
    // document.body.style.color = 'inherit'
    // document.body.style.backgroundColor = 'inherit'
    this.setState({ homeIndex: null })

    const { type, draggableId, source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) return

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)
      this.setState({ columnOrder: newColumnOrder })
      return
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    const startTaskIds = Array.from(start.taskIds)
    let finishTaskIds
    if (start === finish) {
      finishTaskIds = startTaskIds
    } else {
      finishTaskIds = Array.from(finish.taskIds)
    }

    startTaskIds.splice(source.index, 1)
    finishTaskIds.splice(destination.index, 0, draggableId)

    const newStartColumn = {
      ...start,
      taskIds: startTaskIds
    }
    let newFinishColumn
    if (start === finish) {
      newFinishColumn = newStartColumn
    } else {
      newFinishColumn = {
        ...finish,
        taskIds: finishTaskIds
      }
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn
      }
    }
    this.setState(newState)
  }

  render () {
    return (
      <Container>
        <Link
          href="https://github.com/paulina-grunwald/task-dnd-app"
          target="_blank"
          rel="noopener"
          primary
        >
          Check the repo on github
        </Link>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}>
          <Droppable droppableId='all-columns'
            direction='horizontal'
            type='column'>
            {
              (provided) =>
                <ColumnsContainer {...provided.droppableProps} innerRef={provided.innerRef}>
                  {
                    this.state.columnOrder.map((columnId, index) => {
                      const column = this.state.columns[columnId]
                      return <InnerList key={column.id}
                        column={column}
                        taskMap={this.state.tasks}
                        index={index} />
                    })
                  }
                  {provided.placeholder}
                </ColumnsContainer>
            }
          </Droppable>
        </DragDropContext>
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));