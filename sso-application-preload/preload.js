(async () => {

    const LOGIN_PAGE_URL = '';
    const LOGIN_SUCCESS_PAGE_URL = '';
    const LOCATION_CHANGED_CUSTOM_EVENT = 'locationchange';

    const log = (...msgs) => console.log('sso preload:', ...msgs);

    // Signal Glue42 Enterprise that the authentication process is complete.
    const authDone = () => {
        const options = {
            user: "stoyan", // Set accordingly.
            // token: "token",
            // headers: {
            //     "name": "value"
            // }
        };

        log('signal auth is complete');
        glue42gd.authDone(options);
    }

    // Utils
    const listenToLocationChanged = () => {
        window.addEventListener(LOCATION_CHANGED_CUSTOM_EVENT, async () => {
            const href = window.location.href;
            log(`"${LOCATION_CHANGED_CUSTOM_EVENT}" event dispatched, current href - ${href}`);

            // Do proper check.
            const isLoginSuccessfulPage = href === LOGIN_SUCCESS_PAGE_URL;

            if (isLoginSuccessfulPage) {
                log('login successful page');
                authDone();
                return;
            }
        });

        const onLocationChanged = () => {
            window.dispatchEvent(new Event(LOCATION_CHANGED_CUSTOM_EVENT));
        };

        window.originalPushState = history.pushState;
        window.originalReplaceState = history.replaceState;
        window.addEventListener("popstate", () => {
            onLocationChanged();
        });
        history.pushState = function () {
            window.originalPushState.apply(history, arguments);
            onLocationChanged();
        };
        history.replaceState = function () {
            window.originalReplaceState.apply(history, arguments);
            onLocationChanged();
        };
    }

    const initGlue = async () => {
        log('waiting Glue() lib');
        const id = setInterval(async () => {
            if (window.Glue) {
                clearInterval(id);

                const glue = await window.Glue();
                log('glue42 ready -', glue.info);

                window.glue = glue;
            }
        }, 50);
    }

    // Entry point.
    log('started');

    // Detect page.
    const href = window.location.href;
    const isLoginPage = href === LOGIN_PAGE_URL;
    if (isLoginPage) {

        log('on login page');
        return;
    }

    const isLoginSuccessfulPage = href === LOGIN_SUCCESS_PAGE_URL;
    if (isLoginSuccessfulPage) {
        log('login successful page');

        authDone();
        return;
    }

    // listenToLocationChanged()

    log(`unknown page, href - ${href}`);
})();