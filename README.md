# Single Sign-On (SSO) Web App

- This is a front end implementation for the SSO service detailed [here](https://github.com/UnexceptedSpectic/sso-service-backend). It is meant to provide a simple way to use SSO when developing web applications suites. See the backend linked to above prior to getting started here. 
- A minimal SPA that utilizes this front end can be seen [here](https://github.com/UnexceptedSpectic/sso-demo). A more complex example can be seen [here](https://github.com/UnexceptedSpectic/nbad/tree/main/budget-project-frontend).

# Usage
## Dependencies
- This UI depends on a running instance of the SSO backend linked to above. The URL and port of said instance must be specified in the `ssoApi` constant in [`account.service.ts`](https://github.com/UnexceptedSpectic/sso-frontend/blob/main/src/app/account.service.ts). See the linked file for an example.
- 
- This is an angular project; install node package dependencies by running `npm install` from within the clone directory.

## Running

Start a development server using `ng serve` and navigate to `http://localhost:4200/` to access the web app.

## Developing

Below are instructions for how developers can use this front end to implement SSO with their web app suites. See the documentation for the backend service for instructions on how to generate a `ssoSuiteId` for your SSO suite.

### Guidelines
These are some guidelines to follow to ensure the intended integration with the backend mentioned above.

1. Sign in, registration, sign out, and jwt renewal operations should be completed via the SSO web app.
2. If a JWT is near expiry, SSO suite web app constituents should use the SSO web app to renew JWTs. This ensures renewal is synced across the other web apps.    
3. JWT verification should be done SSO suite web app constituents, to validate account sign in status. If a JWT is expired or an account is no longer authenticated using a particular JWT, the web apps should redirect to the SSO web app to prompt for sign in.
4. Accessing the SSO web app on a signed in state will return all the unexpired JWTs representing logged in states for all users of a particular SSO suite. It is up to the developer to determine which jwt/account should be used with the app.

### Endpoints

#### Login

Path: `/login`

Query params:
- `ssoSuiteId`
- `redirectUrl`

#### Jwt renewal

Path: `/login`

Query params:
- `redirectUrl`
- `jwt`

*Note*: This is only a preliminary validation based on JWt expiration status. Developers should still hit the SSO backend `/account/authenticate` endpoint each time access to a protected resource is requested. The primary purpose of this font end service is to provide a shared JWT browser cache for SSO suites consisting of multiple web apps hosted on different domains. This allows for SSO suites to share authentication data via the browser and leaves the task of confirming login state to the SSO suite constituent web apps.

#### Logout

Path: `/logout`

Query params:
- `redirectUrl`
- `jwt`
