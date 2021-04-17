/** Data service for persisting somme entity using REST API. */
const RestApiStorageDataService = class {
  /**
   * Creates data service for persisting some entity using REST API.
   * @param {string} endpointURL - Endpoint for storing entity using REST API.
   */
  constructor(endpointURL) {
    this.endpointURL = endpointURL;
  }

  addEntity(entity) {
    return this._sendRequest('POST', entity);
  }

  changeEntity(entity) {
    return this._sendRequest('PUT', entity);
  }

  deleteEntity(entity) {
    if (!entity || !entity.id) {
      throw new Error('Entity should be set and have an id');
    }
    return this.dateteEntityById(entity.id);
  }

  async dateteEntityById(id) {
    if (!id) {
      throw new Error('Entity should have an id');
    }
    try {
      const response = await fetch(`${this.endpointURL}/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async saveEntities(entities) {
    if (!entities || !(entities instanceof Array)) {
      throw new Error('Entity should be set and have an id');
    }
    try {
      const requests = [];
      entities.forEach(entity => {
        requests.push(this._makeRequest('PUT', entity));
      });
      await Promise.all(requests);
      return requests.reduce((prevResult, request) => prevResult && request.ok, true);
    } catch (error) {
      return false;
    }
  }

  async loadEntities() {
    try {
      const response = await fetch(this.endpointURL);
      if (response.ok) {
        const json = await response.json();
        return json == null || !(json instanceof Array) ? [] : json;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async _loadEntities() {
    try {
      const response = await fetch(this.endpointURL);
      if (response.ok) {
        const json = await response.json();
        return json == null || !(json instanceof Array) ? [] : json;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async _sendRequest(method, entity) {
    try {
      const response = await this._makeRequest(method, entity);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  _makeRequest(method, entity) {
    return fetch(this.endpointURL, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(entity),
    });
  }
};

export default RestApiStorageDataService;
