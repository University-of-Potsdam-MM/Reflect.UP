# LoginProvider

This Provider can be used as a submodule and added as a provider in 
an ionic project. It can perform following login methods:

- `credentialsLogin`: Simple login with credentials
- `oidcLogin`: Login with OpenId-Connect
- `ssoLogin`: Login with Single-Sign-On

## Installation

This project must be cloned/copied to the `src/providers/` directory of your ionic 
project and then simply be imported in `app.modules.ts` and in the component that
should use it. In case you are `git clone`-ing it you should also execute 
`git submodule init` and `git submodule update` so that the parent git repository
knows about it.

## Dependencies

Currently it is only expected that the ionic module `in-app-browser` is installed
in your project because it's needed for performing browser based login. All other
dependencies should be fulfilled by ionic out-of-the-box.

## Usage

Once the provider is set up you can call one of it's login-methods to perform a login. 
Each will return an `Observable<ISession>` to which you can subscribe. Each of those
methods expects two arguments:

- `credentials:ICredentials`: The credentials as username and password
- `loginConfig:ILoginConfig_SSO | ILoginConfig_OIDC | ILoginConfig_Credentials`
                    
The latter argument must be chosen according to the method being used. For example
`ssoLogin()` expects a `ILoginConfig_SSO` as `loginConfig`.

In the following the `loginConfig` expected by each method will be explained:

#### `credentialsLogin()` - `ILoginConfig_Credentials`

- `moodleLoginEndpoint:string`: Login endpoint to be used
- `accessToken:string`: Access token to be used
- `service:string`: Service method to be used
- `moodlewsrestformat:string`: Moodle webservice format to be used

#### `ssoLogin()` - `ILoginConfig_SSO`

- `ssoUrls`: a complex type containing the URLs to be used in SSO-login. It should contain:
    - `pluginUrl:string`: The pluginUrl to be used, params for it can be specified in `pluginUrlParams`
    - `login:string`
    - `tokenUrl:string`
    - `idpBaseUrl:string`
    - `idpUrl:string`
    - `attributeReleaseUrl:string`
    - `pluginUrlParams`: complex type containing parameters that will be added to `pluginUrl`
        - `service:string`
        - `passport:string`

#### `oidcLogin()` - `ILoginConfig_OIDC`

- `tokenUrl:string`: Login endpoint to be used
- `accessToken:string`: Access token
- `contentType:string`: Content type to be used in header
- `grantType:string`: grant_type to be used
- `scope:string`: Scope to be used

### Example configuration and usage 

```typescript
let credentials:ICredentials = {
    username: "username",
    password: "password"
};

let loginConfig:ILoginConfig_SSO = {
    "ssoUrls": {
        "pluginUrl": "https://moodle2.uni-potsdam.de/local/mobile/launch.php",
        "login": "https://moodle2.uni-potsdam.de/login/index.php",
        "tokenUrl": "moodlemobile://token=",
        "idpBaseUrl": "https://idp.uni-potsdam.de/idp/profile/SAML2/Redirect/SSO",
        "idpUrl": "https://idp.uni-potsdam.de/idp/Authn/UserPassword",
        "attributeReleaseUrl": "https://idp.uni-potsdam.de/idp/uApprove/AttributeRelease",
        "pluginUrlParams":{
            "service":"local_mobile",
            "passport":"1002"
        }
    }    
};

this.loginProvider.ssoLogin(
    credentials,
    loginConfig
).subscribe(
    (session:ISession) => {
        // do something with it
    },
    error => {
        // do something about it
    }
);
```