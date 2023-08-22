import {NextResponse} from 'next/server';
import {writeFile} from 'fs/promises';

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
  const isReset = resource === 'reset';
  const action = isReset ? resetSavedData : saveData;

  const body = await request.json();

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
    let savedData = await import('@/data/savedData.json');

    const firstLoad = !!Object.entries(savedData).length;
    const data = !firstLoad ? savedData : await import('@/data/initialData.json');

    if (firstLoad) await saveDataCopy(data);

    console.log({data, resource, r: data[resource]})

    if (resource[1] != null) {
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
  data = Array.isArray(data) ? data : [data];

  // Load
  const newData = {...await getData()};
  if (!Object.keys(newData).includes(resource)) return;

  const resourceData = newData[resource];

  // Insert
  data.forEach(item => {
    let newItem = resourceData.find(i => i.id === item.id);

    if (newItem) {
      resourceData[resourceData.indexOf(newItem)] = {...newItem, ...item};
    } else {
      const newId = Math.max(...resourceData.map(i => i.id)) + 1;
      const {id, ...rest} = item;
      newItem = {id: newId, ...rest};
      resourceData.push(newItem);
    }
  });

  newData[resource] = resourceData;

  // Write
  await writeFile('./src/data/savedData.json', JSON.stringify(newData, null, "\t"));
};

const saveDataCopy = async (data) => {
  await writeFile('./src/data/savedData.json', JSON.stringify(data, null, "\t"));
}

const resetSavedData = async () => {
  await writeFile(`./src/data/savedData.json`, JSON.stringify({}));
}
