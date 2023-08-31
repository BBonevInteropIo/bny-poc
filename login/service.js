
(async  function start() {
  
  const initializeGlue42 = async () => {
    window.glue = await Glue({appManager: "full"});
  };

  function sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms || 500))
  }

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

  async function update() {
    const user = glue42gd?.sid

    const apps = await getAppsForUser(user);

    await glue.appManager.inMemory.import(apps, "replace");
  }

  async function startPolling(interval) {
      while(true) {
        try {
          await update()
        } catch (error) {
          console.error(error)
        }
        
        await sleep(5000)
      }
  }


  await initializeGlue42();
  await startPolling()
})()