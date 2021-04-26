const domain = "https://api.tsophen.com";

interface RequestStructure {
  headers?: HeadersInit
  body?: BodyInit
  mode?: RequestMode
  cache?: RequestCache
  credentials?: RequestCredentials
}

const execute = async (endpoint: string, method: string, settings?: RequestStructure): Promise<Response | void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!settings) settings = {};
      if(!settings.headers) settings.headers = { "content-type": "application/json" };
      if(!settings.body) settings.body = "";
      if(!settings.mode) settings.mode = "cors";
      if(!settings.cache) settings.cache = "no-cache";
      if(!settings.credentials) settings.credentials = "omit";

      const requestSettings = {
        method: method,
        mode: settings.mode,
        cache: settings.cache,
        headers: settings.headers,
        credentials: settings.credentials
      }
      if(method !== "get" && method !== "head")
        Object.assign(requestSettings, { body: settings.body });

      const response = await fetch(endpoint, requestSettings);

      return resolve(response);
    } catch(exception) {
      return reject(exception)
    }
  });
}

const Endpoints = {
  users: {
    create: {
      link: `${domain}/v1.0/users`,
      method: "post"
    },
    vault: {
      load: {
        link: `${domain}/v1.0/users/vault`,
        method: "get"
      },
      update: {
        link: `${domain}/v1.0/users/vault`,
        method: "put"
      }
    }
  },
  auth: {
    login: {
      link: `${domain}/v1.0/auth/login`,
      method: "post"
    },
    refreshToken: {
      link: `${domain}/v1.0/auth/refresh-token`,
      method: "get"
    }
  }
}

export default execute;
export { Endpoints };