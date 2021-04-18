const execute = async (endpoint: string, method: string, headers?: HeadersInit, body?: string): Promise<Response | void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(endpoint, {
        method: method,
        cache: "no-cache",
        headers: (headers ? headers : {
          "Content-Type": "application/json"
        }),
        body: body
      });

      return resolve(response);
    } catch(exception) {
      return reject(exception)
    }
  });
}

export default execute;