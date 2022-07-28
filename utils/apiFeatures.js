class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // console.log(this.query);
    // console.log(this.queryString);
    //1) filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedField = ['page', 'sort', 'limit', 'fields'];
    excludedField.forEach((el) => delete queryObj[el]);
    // filter query obj to ignore query fields page sort limit fields
    // console.log(req.query);

    //2) advanced filtering by add gte gt lt lte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    //http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy
    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // const sortBy = req.query.sort.split(',').join(' ');
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      //sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // console.log(req.query.fields);
      const fields = this.queryString.fields.split(',').join(' ');
      // console.log(fieldsStr);
      this.query = this.query.select(fields);
    } else {
      // query select with minus delete from response
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //5 pagination
    //?page=2&limit=10  1 to 10 page 1, 11 to 20 page 2
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
