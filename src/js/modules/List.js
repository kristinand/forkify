import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.foodList = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.foodList.push(item);
    this.persistData();
    return item;
  }

  updateItemCount(id, newCount) {
    const prevFoodList = this.foodList;
    const foodIndex = prevFoodList.findIndex((food) => food.id === id);
    this.foodList[foodIndex].count = newCount;
  }

  deleteItem(id) {
    const index = this.foodList.findIndex((item) => item.id === id);
    this.foodList.splice(index, 1);
    this.foodList.length > 0 ? this.persistData() : localStorage.removeItem('food-list');
  }

  updateCount(id, newCount) {
    this.foodList.find((item) => item.id === id).count = newCount;
    this.persistData();
  }

  persistData() {
    localStorage.setItem('food-list', JSON.stringify(this.foodList));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('food-list'));
    if (storage) this.foodList = storage;
    return storage;
  }
}
