import axios from 'axios';

const apiKey = process.env.API_KEY;

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults(offset = 0, number = 100) {
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&offset=${offset}&number=${number}&apiKey=${apiKey}`
      );
      this.result = res.data.results;
      this.totalResults = res.data.results.length;
    } catch (err) {
      console.log(err);
    }
  }
}
