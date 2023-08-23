import {NextResponse} from 'next/server';
import {writeFile} from 'fs/promises';
const fs = require('fs/promises'); // Import the fs/promises module


// Routes
export async function GET(request, {params}) {
  const response = await getData(params?.resource);

  return NextResponse.json(
    response ? response : {error: "Unknown resource"},
    {status: response ? 200 : 404}
  );
}

export async function POST(request, {params}) {
  const {resource} = params;
  console.log(resource)
  const isReset = resource === 'reset';
  console.log("isReset", isReset)
  const action = isReset ? resetSavedData : saveData;

  const body = await request.json();
    console.log("received")
    console.log(body);

  const response = await (action(resource, body)).then(async r => {
    return await getData(resource);
  });

  return NextResponse.json(
    response ? response : {error: "Unknown resource"},
    { status: response ? 200 : 404 }
  );
}

const getData = async (resource) => {
  return await new Promise(async (resolve, reject) => {
    let savedDataContent = await fs.readFile('./src/data/savedData.json', 'utf-8');

    let savedData = JSON.parse(savedDataContent);

    const firstLoad = !!Object.keys(savedData).length && Object.entries(savedData).length > 1;
    //console.log(Object.keys(savedData).length)
    //console.log(firstLoad)
    const dataContent = firstLoad
    ? savedDataContent
    : await fs.readFile('./src/data/initialData.json', 'utf-8');
    const data = JSON.parse(dataContent);

    //console.log("data", data)
    if (!firstLoad) await saveDataCopy(data);

    //console.log({data, resource, r: data[resource]})

    if (resource && resource.length > 0 && resource[1] != null) {
      //console.log(data[resource[0]])
      let newItem = data[resource[0]].find(i => resource[1] == i.id);
      if (newItem) {
          resolve(newItem);
      }
    }

    resolve(resource && resource !== 'reset' ? data[resource] : data);
  });
};

const saveData = async (resource, data) => {
  //console.log("Saving data!")
  //console.log(data)
  //console.log(Array.isArray(data))
  data = Array.isArray(data) ? data : [data];
  //console.log(data);

  // Load
  const newData = {...await getData()};
  //console.log("resource", resource);
  //console.log(Object.keys(newData).includes(resource))
  //console.log(Object.keys(newData).includes(resource[0]))
  if (!Object.keys(newData).includes(resource[0])) {
    //console.log("COULDNT BE FOUND!")
    return;
  }


  const resourceData = newData[resource];
  //console.log("RD", resourceData);

  // Insert
  data.forEach(item => {
    //console.log("THE IIIIIIIIITEM");
    //console.log(item)
    //console.log("-------------THE IIIIIIIIITEM--------------");
    //console.log("newItem id:", item.id)
    let newItem = resourceData.find(i => i.id === item.id);

    if (newItem) {
      //console.log("not new!")
      resourceData[resourceData.indexOf(newItem)] = {...newItem, ...item};
    } else {
      //console.log("Its new!")
      const newId = Math.max(...resourceData.map(i => i.id)) + 1;
      const {id, ...rest} = item;
      newItem = {id: newId, ...rest};
      resourceData.push(newItem);
      //console.log(resourceData)
    }
  });

  newData[resource] = resourceData;
  //console.log("Final!")

  // Write
  await writeFile('./src/data/savedData.json', JSON.stringify(newData, null, "\t"));
  //console.log("saved?")
};

const saveDataCopy = async (data) => {
  //console.log("saveData",data.length)
  await writeFile('./src/data/savedData.json', JSON.stringify(data, null, "\t"));
}

const resetSavedData = async () => {
  await writeFile(`./src/data/savedData.json`, JSON.stringify({}));
}
