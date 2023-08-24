import { useState, useEffect, useRef } from 'react'

const dndStyles = {
  title: {
    color:"red",
  },
  body: {
    border:"1px solid black",
  },
  dragItem: {
    padding:"5px",
    margin:"2px",
    background:"white",
    display:"flex",
    justifyContent:"space-around"
  },
  dropzone: {
    height:"5px",
    border: "1px solid lightblue",
  }
}

export const DragAndDropList = (props) => {
  const [draggedItemPos, setDraggedItemPos] = useState(null)
  const [arrayData, setArrayData] = useState(props.arrayToDisplay)
  const ItemElementDisplay = props.ItemElementDisplay;

  return (
    <div>
      <div style={dndStyles.title}>{props.title}</div>
      <div style={dndStyles.body}>

        <DragDropzone
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          positionNo={0}
        />

        {
          arrayData.map((item, i) => {
            return (
              <div key={i}>
                <SimpleDragElement
                  item={item}
                  dragEvent={onDragElement}
                  positionNo={i}
                  setDraggedItemPos={setDraggedItemPos}
                  ItemElementDisplay={ItemElementDisplay}
                  additionalElementProps={props.additionalElementProps}
                />
                <DragDropzone
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  positionNo={i+1}
                />
              </div>
            )
          })
        }



      </div>
    </div>
  )

  function onDragElement(event, positionNo, setDraggedItem) {
    setDraggedItemPos(positionNo);
  }

  function onDragEnter(event, item) {
    event.preventDefault();
    if (event.target.classList.contains("dropzone")) {
      event.target.classList.add("dragover");
    }
  }

  function onDragOver(event, item) {
    event.preventDefault();
  }

  function onDragLeave(event, item) {
    if (event.target.classList.contains("dropzone")) {
      event.target.classList.remove("dragover");
    }
  }

  function onDrop(event, posNo) {
    moveDraggedItemToArray(posNo);
  }

  function moveDraggedItemToArray(posNo) {
    var newArrayData = [...arrayData];
    array_move(newArrayData, draggedItemPos, posNo);

    if (props.saveArrayData != null) {
      props.saveArrayData(newArrayData);
    }
    setArrayData(newArrayData);
  }

  function array_move(arr, old_index, new_index) {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };
}

const DragDropzone = (props) => {
  return (
    <div
      className={"dropzone"}
      style={dndStyles.dropzone}
      onDragEnter={(event) => props.onDragEnter(event)}
      onDragOver={(event) => props.onDragOver(event)}
      onDragLeave={(event) => props.onDragLeave(event)}
      onDrop={(event) => props.onDrop(event, props.positionNo)}
    />
  )
}

const SimpleDragElement = (props) => {

  const DispElement = props.ItemElementDisplay;

  return (
    <div
      style={dndStyles.dragItem}
      draggable="true"
      onDragStart={(event) => props.dragEvent(event, props.positionNo, props.setDraggedItemPos)}
    >
      {
        DispElement ?
        <DispElement
          item={props.item}
          itemNo={props.positionNo}
          {...props.additionalElementProps}
        />
        :
        Object.keys(props.item).map((key) => {
          return (<div key={key}>{key}:{props.item[key]}</div>)
        })
      }
    </div>
  )
}

export default DragAndDropList;
