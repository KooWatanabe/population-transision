import Client from '../http/client';
import { PREFECTURE, POPULATION } from '../endpoints';

const ResasApi = {
  pref: async () => {
    try {
      const response = await Client('GET', PREFECTURE);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  population: async (id) => {
    try {
      const params = `?prefCode=${id}&cityCode=-`;
      const response = await Client('GET', POPULATION + params);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default ResasApi;
