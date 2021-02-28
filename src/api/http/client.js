const getHeader = (method, params) => {
    const option = {
      method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-API-KEY': process.env.RESAS_API_KEY,
      },
    };

    if (Object.keys(params).length !== 0) {
      option.body = JSON.stringify(params);
    }

    return option;
  };

  const client = async (method, url, params = {}) => {
    const result = await fetch(url, getHeader(method, params));

    if (result.status === 204) {
      return {};
    }

    const response = await result.json();

    if ([400, 401, 404, 500, 502, 503].includes(result.status)) {
      const errorMessage = response.error ? response.error.message : response.message;
      throw new Error(errorMessage);
    }

    return response;
  };

  export default client;
