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
  const [ingreData, setIngreData] = useState(null)
  const [bizData, setBizData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  const [ingredientsModalActive, setIngredientsModal] = useState(false)
  const [typeModalActive, setTypeModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessLogicResponse = await fetch('/api/businessLogic');
        const businessLogicData = await businessLogicResponse.json();
        setBizData(businessLogicData);

        const ingredientsResponse = await fetch('/api/ingredients');
        const ingredientsData = await ingredientsResponse.json();
        setIngreData(ingredientsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoaded(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataLoaded && ingreData !== null) {
      if (props.loadedData && props.loadedData !== null) {
        parseLoadedSaladData(props.loadedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

  }, [dataLoaded, ingreData, bizData])

  if (isLoading)
      return (<div className={styles.loading}>Loading...</div>)

   /*I had refactored an entire ingredients component to sort out ingredients
   and jazz, then I noticed the total cost, so I reverted it all */

  function parseLoadedSaladData(newSaladData) {
    //console.log("loading salad data")
    //console.log(newSaladData)

    let newSalad = {...saladData};

    newSaladData.ingredients.forEach((item, i) => {
      //console.log(item.id)
      //console.log(ingreData)
      let ingredientData = ingreData.find((ingredient) => ingredient.id == item.id);
      ingredientData.count = item.numOfServings;
      newSalad.ingredients.push(ingredientData);
    });

    newSalad.id = newSaladData.id;
    newSalad.name = newSaladData.name;
    newSalad.type = newSaladData.size;
    newSalad.saladType = bizData.saladTypes[newSalad.type];

    //TO-DO: PRICE TALLY?!

    setSaladData(newSalad);
    return true;
  }

  function saveSaladData() {

    //console.log(saladData);

    var prepDataBase = {
        "name": saladData.name,
        "id": saladData.id ? saladData.id : null,
        "size": saladData.type,
        "ingredients": [],
        "cost": saladTotalCost(),
        "targetStock": 0,
        "currentStock": 0,
        "price": 0
    }

    saladData.ingredients.forEach((item, i) => {
      var newIngredient = {
          "id": item.id,
          "numOfServings": item.count
        }

      prepDataBase.ingredients.push(newIngredient);
    });

    //console.log(prepDataBase)

    fetch('/api/salads', {
        method: 'POST',
        body: JSON.stringify(prepDataBase),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
     .then((response) => response.json())
     .then((data) => {
        console.log(data);
        alert("Successfully Saved!");
        // Handle data
        // REDIRECT
        window.location.href = "/";
     })
     .catch((err) => {
        console.log(err.message);
        alert(err.message)
     });

  }

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


  const saladTotalCost = () => {
    let totalCost = 0;
    saladData.ingredients.forEach((item, i) => {
      totalCost += item.costPerServing * item.count;
    });
    return totalCost.toFixed(2);
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
      <div className={styles.details}>
        <div className={styles.flex}>
          <div className={styles.flexfill}>
            <EditTextField value={saladData.name} setValue={updateSaladName}/>
          </div>
          <div
            className={styles.btn}
            onClick={() => setTypeModal(true)}
          >{saladData.type}</div>
        </div>
        <div className={styles.flex}>
          <div className={styles.flexfill}></div>
          <p>
            <sub>Target Cost:</sub> <span>{moneyLabel(saladData.saladType.targetCost)}</span>
          </p>
          <p>
            <sub>Target Weight:</sub> <span>{saladData.saladType.targetWeight}g</span>
          </p>
        </div>
        <div className={styles.flex}>
          <div className={styles.flexfill}></div>
          <p><sub>Total cost:</sub> {moneyLabel(saladTotalCost())}</p>
          <p><sub>Total weight:</sub> {saladTotalWeight()}g</p>
        </div>
      </div>

      <div>

        <div>
        {
          saladData["ingredients"].length == 0
          ?
          (
            <div className={styles.ingredientDisp}>
              <div className={styles.fullWidthCenter}>Add some tasty ingredients!</div>
            </div>
          )
          :
          (saladData["ingredients"].map((item, i)=>{
            return (
              <SaladIngredient
                className={styles.ingredientEle}
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

        <div className={styles.fullWidthCenter}>
          <div
            className={styles.btn}
            onClick={() => setIngredientsModal(true)}
          >+ ADD +</div>
        </div>

      </div>


      <QuickModal
        title={"Salad Types"}
        show={typeModalActive}
        showComponent= {
          <SaladTypesList
            updateSaladType={updateSaladType}
          />
        }
        closeModal={() => setTypeModal(false)}
      />


      <QuickModal
        title={"Salad Ingredients"}
        show={ingredientsModalActive}
        showComponent= {
          <SaladIngredientsList
            addIngredientToSalad={addIngredientSalad}
          />
        }
        closeModal={() => setIngredientsModal(false)}
      />

      <div className={styles.bottomArea}>
        <div className={styles.btn} onClick={() => saveSaladData()}>Save</div>
      </div>
    </div>
  )
}



const SaladIngredientsList = (props) => {

  const [ingreData, setIngreData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data) => {
        setIngreData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return (
    <div className={styles.center}>
      <h1>Loading potatoes...</h1>
    </div>
  )
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
        <div
          className={styles.quickModalBlur}
          onClick={() => props.closeModal()}
        />
        <div className={styles.quickModalCont} >
          <div className={styles.quickModalHeader}>
            <div className={styles.quickModalTitle}>{props.title}</div>
            <div
              className={styles.quickModalClose}
              onClick={() => props.closeModal()}
            >X</div>
          </div>
          <div className={styles.quickModalBody}>
            {props.showComponent}
          </div>
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
    //console.log(event.key)

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
          (<h1 className={styles.titleText}>{props.value}</h1>)
          :
          (<input
              ref={inputRef}
              className={styles.titleTextField}
              value={props.value}
              onChange={() => props.setValue(event.target.value)}
              onKeyPress={handleKeyPress}
          />)
        }
        <div className={styles.textFieldEdit}>
          <p onClick={toggleEdit}> {edit ? "Save" : "Edit"}</p>
        </div>
      </div>
    </div>
  )
}


const moneyLabel = (value) => {
  return (Number(value)).toFixed(2) + "€";
}

export default SaladMaker;
