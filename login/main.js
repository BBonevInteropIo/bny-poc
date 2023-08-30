
(async function start() {

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

  async function handleLoginClick() {

    const user = document.getElementById('username').value 
    const password = document.getElementById('password').value

    const apps = await getAppsForUser(user);

    await glue.appManager.inMemory.import(apps);

    await window.glue42gd.authDone({user: user});
  }


  function registerLoginAction() {
    const loginButton = document.getElementById('login');

    loginButton.addEventListener('click', handleLoginClick);

    const userInput = document.getElementById('username');

    userInput.addEventListener('keyup', () => {
       if(userInput.value.trim().length < 3) {
          loginButton.disabled = true;
        } else {
          loginButton.disabled = false;
     }
    })
  }

  await initializeGlue42();

  registerLoginAction();
})()