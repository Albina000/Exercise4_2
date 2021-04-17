/** Data service for persisting somme entity using LocalStorage. */
const LocalStorageDataService = class {
  /**
   * Creates data service for persisting some entity using LocalStorage.
   * @param {string} entityName - Key for storing entity in LocalStorage.
   */
  constructor(entityName) {
    this.entityName = entityName;
  }

  addEntity(entity) {
    const entities = this.loadEntities();
    entities.push(entity);
    return this.saveEntities(entities);
  }

  changeEntity(entity) {
    if (!entity || !entity.id) {
      throw new Error('Entity should have an id');
    }
    const entities = this.loadEntities();
    const indexToChange = entities.findIndex(currentEntity => {
      return currentEntity.id === entity.id;
    });
    if (indexToChange > -1) {
      entities[indexToChange] = { ...entity };
      return this.saveEntities(entities);
    }

    return this.addEntity(entity);
  }

  deleteEntity(entity) {
    if (!entity || !entity.id) {
      throw new Error('Entity should be set and have an id');
    }
    return this.dateteEntityById(entity.id);
  }

  dateteEntityById(id) {
    const entities = this.loadEntities();
    const indexToChange = entities.findIndex(currentEntity => {
      return currentEntity.id === id;
    });
    if (indexToChange > -1) {
      entities.splice(indexToChange, 1);
      return this.saveEntities(entities);
    }

    return false;
  }

  saveEntities(entities) {
    try {
      localStorage.setItem(this.entityName, JSON.stringify(entities));
      return true;
    } catch (error) {
      return false;
    }
  }

  loadEntities() {
    try {
      const data = localStorage.getItem(this.entityName);
      const parsedData = JSON.parse(data);
      return parsedData == null ? [] : parsedData;
    } catch (error) {
      return false;
    }
  }
};

export default LocalStorageDataService;
