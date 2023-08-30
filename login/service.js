
(async  function start() {

  let registeredApps = {}

  const initializeGlue42 = async () => {
    window.glue = await Glue({appManager: "full"});
  };


  async function fetchUserAppsMap () {
    return fetch('./config/userAppsMap.json')
      .then((response) => response.json())
      .catch((err) => {
          console.error('fetchUserAppsMap() -> internal error: ', err);
          return [];
      });
  }

  async function fetchApps () {
    return fetch('./config/apps.json')
      .then((response) => response.json())
      .catch((err) => {
          console.error('fetchApps() -> internal error: ', err);
          return [];
      });
  }


  async function getAppsForUser(user) {
    const apps = await fetchApps();
    const userAppsMap = await fetchUserAppsMap(user)

    const result = []
    if (apps && userAppsMap && userAppsMap[user]) {
        apps.forEach(app => {
        if (userAppsMap[user].includes(app.name)) {
          result.push(app)
        }
      })
    }
    
    return result;
  }

  async function shouldUpdateAppDefinitions(apps) {
    let result = false;

    if (apps.length !==  Object.keys(registeredApps).length) {
      result = true;
    } else {
      for(let i = 0; i < apps.length; i++) {
        const app = apps[i]
        if (!registeredApps[app.name]) {
          result = true;
          break;
        }
      }
    }
   
    return result
  }

  async function update() {
    const user = glue42gd?.sid

    const apps = await getAppsForUser(user);

    if (shouldUpdateAppDefinitions(apps)) {
        await glue.appManager.inMemory.import(apps, "replace");
        registeredApps = apps.reduce((obj,curr)=> (obj[curr.name]=true,obj),{});
    }
  }

  async function startPolling(interval) {
    setInterval(() => {
      update()
    }, interval)
  }


  await initializeGlue42();
  startPolling(5000)
})()