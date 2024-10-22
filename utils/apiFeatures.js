class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 1) Pagination
  paginate(documentsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};

    pagination.page = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(documentsCount / limit);

    // Next page
    if (endIndex < documentsCount) {
      pagination.next = page + 1;
    }

    // Prev page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

  // 2) Filtering
  filter(categoryObj) {
    const queryStringObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((field) => delete queryStringObj[field]);

    // Apply filteration using [gte, gt, lte, lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const queryRes = JSON.parse(queryStr);

    if (categoryObj) {
      this.mongooseQuery = this.mongooseQuery.find({
        ...queryRes,
        category: categoryObj.category,
      });
    } else {
      this.mongooseQuery = this.mongooseQuery.find(queryRes);
    }

    return this;
  }

  // 3) Sorting
  sort() {
    if (this.queryString.sort) {
      // "sold,price" => [sold , price] => "sold price"
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  // 4) Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      // "sold,price" => [sold , price] => "sold price"
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  // 5) Searching
  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      console.log(this.queryString.keyword);
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }
}

module.exports = ApiFeatures;
