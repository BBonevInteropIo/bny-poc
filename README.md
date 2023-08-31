## Setup Login + Entitlement service

1. Move `login` folder to `%LocalAppData%\Tick42\Glue42\Demos\Web`
2. Move `demos-http-server` folder to `%LocalAppData%\Tick42\Glue42\Demos\Web`
3. Move `systemApps` folder to `%LocalAppData%\Tick42\Glue42\GlueDesktop\config`
4. Move `entitlement-service.json` to `%LocalAppData%\Tick42\Glue42\GlueDesktop\config\apps`
5. Do the following updates in system.json configuration file `%LocalAppData%\Tick42\Glue42\GlueDesktop\config\system.json`
  - Add the http server
```json
 "systemAppStores": [
        {
            "type": "path",
            "details": {
                "path": "./config/systemApps"
            }
        }
    ],
```
  - Add a login screen that will mock authentication

```json
    "ssoAuth": {
        "authController": "sso",
        "options": {
            "url": "http://localhost:22080/login/login.html",
            "window": {
                "width": 500,
                "height": 650,
                "mode": "flat"
            }
        }
    }
```

  - Remove `server` top level property - we are not using Glue42 Server

## Entitlement system instructions

### Edit application definitions - Contains application definitions
- Edit `%LocalAppData%\Tick42\Demos\Web\login\config\apps.json`
### Edit the users and application access - Contains map with users and the application names that they have access to
- Edit `%LocalAppData%\Tick42\Demos\Web\login\config\userAppsMap.json`

#### Note: The visibility of applications, defined in the other app stores (described in `system.json`), are not affected by the configuration in `userAppsMap.json`