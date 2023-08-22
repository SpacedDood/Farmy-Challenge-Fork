import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react'

export const SaladMaker = (props) => {

  var baseSalad = {
    "id" : null,
    "name":"New Salad",
    "type":"small",
    "saladType" : {
      "targetCost" : 2.5,
      "targetWeight" : 250
    },
    "ingredients": [],
  }

  const [saladData, setSaladData] = useState(baseSalad)
  const [ingreData, setingreData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    /*if (props.saladData != null) {
      setSaladData(props.saladData)
    }*/

    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data) => {
        setingreData(data)
        setLoading(false)
      })
  }, [])


  function updateSaladName(newName) {
    let newSalad = {...saladData};
    newSalad.name = newName;
    setSaladData(newSalad);
    return true;
  }

  function updateSaladType(typeName, newSaladType) {
    let newSalad = {...saladData};
    newSalad.type = typeName;
    newSalad.saladType = newSaladType;
    setSaladData(newSalad);
    return true;
  }

  function addIngredientSalad(ingredientNo) {
    let ingreToAdd = {...ingreData[ingredientNo]};
    ingreToAdd.count = 1;
    let newSalad = {...saladData};
    newSalad["ingredients"].push(ingreToAdd);
    setSaladData(newSalad);
    return true;
  }

  function removeIngredientSalad(ingrePos) {
    let newSalad = {...saladData};
    let removed = newSalad["ingredients"].splice(ingrePos, 1);
    setSaladData(newSalad);
    return true;
  }

  function updateIngredientCount(ingrePos, ingreValue) {
    let newSalad = {...saladData};
    console.log(newSalad["ingredients"]);
    newSalad["ingredients"][ingrePos].count = ingreValue;
    setSaladData(newSalad);
    return true;
  }


  /* EXPECTED DATA PREP:

  {
    "name": "Example Salad",
    "id": 1,
    "size": "small",
    "ingredients": [
      {
        "id": 1,
        "numOfServings": 1
      }
    ],
    "cost": 0.3,
    "targetStock": 20,
    "currentStock": 0,
    "price": 0.33
  }

   */

  function saveSaladData() {

  }



  const saladTotalCost = () => {
    let totalCost = 0;
    saladData.ingredients.forEach((item, i) => {
      console.log(item)
      totalCost += item.costPerServing * item.count;
    });
    return totalCost;
  }

  const saladTotalWeight = () => {
    let totalCost = 0;
    saladData.ingredients.forEach((item, i) => {
      //console.log(item)
      totalCost += item.weightPerServing * item.count;
    });
    return totalCost;
  }




  return (
    <div className={styles.fullWidth}>
      <div>
        <EditTextField value={saladData.name} setValue={updateSaladName}/>
        <br />
        <div className={styles.flex}>
          <p className={styles.flexfill}>Type: <span>{saladData.type}</span></p>
          <p>
            <sub>Target Cost:</sub> <span>{moneyLabel(saladData.saladType.targetCost)}</span>
          </p>
          <p>
            <sub>Target Weight:</sub> <span>{saladData.saladType.targetWeight}g</span>
          </p>
        </div>
      </div>

      <div>
        <div className={styles.flex}>
          <div className={styles.flexfill}>
            <div className={styles.btn}>Change Type</div>
          </div>
          <p><sub>Total cost:</sub> {moneyLabel(saladTotalCost())}</p>
          <p><sub>Total weight:</sub> {saladTotalWeight()}g</p>
          <p></p>
        </div>

        <div>
        {
          saladData["ingredients"].length == 0
          ?
          (
            <div className={styles.ingredientDisp}>
              Add some tasty ingredients!
            </div>
          )
          :
          (saladData["ingredients"].map((item, i)=>{
            return (
              <SaladIngredient
                key={i}
                ingreNo={i}
                ingredient={item}
                removeIngredient={removeIngredientSalad}
                updateIngredientCount={updateIngredientCount}
              />
            );
          }))
        }
        </div>

        <div className={styles.btn}>+ ADD +</div>

      </div>

      <SaladTypesList
        updateSaladType={updateSaladType}
      />

      <SaladIngredientsList
        addIngredientToSalad={addIngredientSalad}
      />

      <div className={styles.flexbetween}>
        <div className={styles.btn}>Cancel</div>
        <div className={styles.btn} onClick={() => saveSaladData()}>Save</div>
      </div>
    </div>
  )
}



const SaladIngredientsList = (props) => {

  const [ingreData, setingreData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data) => {
        setingreData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!ingreData) return <p>No ingredient data</p>

  return (
    <div>
      {ingreData.map((ingredient, i) => {
        return (
          <AddSaladIngredient
            key={i}
            ingreNo={i}
            ingreData={ingredient}
            addToSalad={props.addIngredientToSalad}
          />
        )
      })}
    </div>
  )
}

const SaladTypesList = (props) => {

    const [bizData, setbizData] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      fetch('/api/businessLogic')
        .then((res) => res.json())
        .then((data) => {
          setbizData(data)
          //console.log(data)
          setLoading(false)
        })
    }, [])

    if (loading) {
      return(
        <div>LOADING...</div>
      )
    } else {
      //console.log(bizData);
      return(
        <div className={styles.flexbetween}>
          {
            Object.keys(bizData.saladTypes).map((key, index) => {
              //console.log(bizData.saladTypes)
              return (
                <div key={index}>
                <p>Type: {key}</p>
                <p>Cost: {moneyLabel(bizData.saladTypes[key].targetCost)}</p>
                <p>Weight: {bizData.saladTypes[key].targetWeight}g</p>
                <div className={styles.btn} onClick={()=> {props.updateSaladType(key, bizData.saladTypes[key])}}>Select</div>
                </div>
              )
            })
          }
        </div>
      )
    }
}

const SaladIngredient = (props) => {

  function setCount(value) {
    if (value <= -1) {
      props.removeIngredient(props.ingreNo)
    } else {
      props.updateIngredientCount(props.ingreNo, value);
    }
  }

  return (
    <div className={styles.ingredientDisp}>
      <div className={styles.drag}>:</div>
      <p>{props.ingredient.name}</p>

      <div className={styles.flex}>
        <Counter
          labelText={"Servings:"}
          className={styles.servingsCounter}
          count={props.ingredient.count}
          setCount={setCount}/>
      </div>

      <p>{(props.ingredient.count * props.ingredient.costPerServing).toFixed(2)}€</p>
      <p>{(props.ingredient.count * props.ingredient.weightPerServing)}g</p>
      <div onClick={() => props.removeIngredient(props.ingreNo)}>Trash</div>
    </div>
  )
}

const AddSaladIngredient = (props) => {
  return (
    <div className={styles.ingredientDisp}>
      <p>{props.ingreData.name}</p>
      <p>{props.ingreData.weightPerServing}g</p>
      <p>{moneyLabel(props.ingreData.costPerServing)}</p>
      <div className={styles.btn} onClick={() => props.addToSalad(props.ingreNo)}>+</div>
    </div>
  )
}

/* ADDITIONAL COMPONENTS */

const QuickModal = (props) => {

  if (props.show) {
    return (
      <div className={styles.quickModalWrap} >
        <div className={styles.quickModalCont} >
          {props.showComponent}
        </div>
      </div>
    );
  } else {
    return null;
  }

}

const Counter = (props) => {
  return (
    <div className={props.className}>
      {props.labelText ? <label>{props.labelText}</label> : null}
      <div className={styles.btn} onClick={() => props.setCount(props.count-1)}>-</div>
      <input value={props.count} onChange={() => props.setCount(event.target.value)}/>
      <div className={styles.btn} onClick={() => props.setCount(props.count+1)}>+</div>
    </div>
  )
}

const EditTextField = (props) => {
  const [edit, setEdit] = useState(false)
  const [initialValue, setInitialValue] = useState();
  const inputRef = useRef(null);

  useEffect(() => {
    if (edit && inputRef.current) {
      inputRef.current.focus();
    }
  },  [edit]);

  function toggleEdit() {
    if (!edit) {
      setInitialValue(props.value)
    }
    //ROOM FOR SAVE ON EDIT?
    setEdit(!edit)
  }

  function handleKeyPress(event) {
    console.log(event.key)

    if (event.key === 'Enter') {
      toggleEdit();
    }
    //ESCAPE KEY NOT BEING PICKED UP!
    //OVERENGINEERING is not good use of time.
    //But it would be swag if it worked.
    if (event.key === 'Escape') {
      toggleEdit();
      props.setValue(initialValue)
    }
  }

  return (
    <div className={styles.textFieldCont}>
      <div className={styles.flex}>
        {
          !edit ?
          (<h1>{props.value}</h1>)
          :
          (<input
              ref={inputRef}
              value={props.value}
              onChange={() => props.setValue(event.target.value)}
              onKeyPress={handleKeyPress}
          />)
        }
        <div className={styles.textFieldEdit}>
          <sup onClick={toggleEdit}> {edit ? "Save" : "Edit"}</sup>
        </div>
      </div>
    </div>
  )
}


const moneyLabel = (value) => {
  return (value).toFixed(2) + "€";
}

export default SaladMaker;
