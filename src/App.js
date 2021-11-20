import React, {useState} from 'react';
import './App.css';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _, { set } from "lodash";
import {v4} from "uuid";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './Components/Navbar';

function App() {
  const [text, setText] = useState("")
  const [groups, setGroups] = useState("")
  const [state, setState] = useState({
    groups: {
      title: "Programming",
      items: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = {...state[source.droppableId].items[source.index]}

    setState(prev => {
      prev = {...prev}
      // remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)


      // adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

// Add item
  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        groups: {
          ...prev.groups,
          items: [
            {
              id: v4(),
              name: text
            },
            ...prev.groups.items
          ]
        }
      }
    })

    setText("")
  }

// Add group
  const addGroup = () => { 
    setState(prev => {
      return {
        ...prev,
        [v4()]: {
          title: groups,
          items: []
        }
      }
    })
    setGroups("")
  }


  return (
    <div>
      <Navbar />
    <div className="App">
      
      {/* Sidebar */}
      <div class="container-fluid">
    <div class="row flex-nowrap">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li class="nav-item">
                        <a href="/" class="nav-link align-middle px-0">
                            <i className="fs-4 bi-archive"></i> <span class="ms-1 d-none d-sm-inline">Workspaces</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        {/* Content */}
        <center>
      <div className="d-flex py-3 justify-content-center">
        <input className=" w-50 form-control me-2" type="text" value={text} placeholder="https://yoursite.com/" onChange={(e) => setText(e.target.value)}/>
        <button className="btn btn-outline-primary" onClick={addItem}>Add tab</button>
      </div>

      <div className="d-flex py-3 justify-content-center">
        <input className=" w-50 form-control me-2" type="text" value={groups} placeholder="Ex: Work" onChange={(g) => setGroups(g.target.value)}/>
        <button className="btn btn-outline-primary" onClick={addGroup}>Add group</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"}>
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return(
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}
                    >
                      {data.items.map((el, index) => {
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided, snapshot) => {
                              console.log(snapshot)
                              return(
                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <a className="tab-link" href={el.name} target="_blank" rel="noopener noreferrer">
                                  {el.name}
                                  </a>
                                  
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
      </center>
      {/* End of Content */}
    </div>
</div>
      {/* End of Sidebar */}
    </div>
    </div>
  );
}

export default App;
