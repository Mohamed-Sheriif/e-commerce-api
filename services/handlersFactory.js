const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);

    res.status(201).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    // Build query
    const documentsCount = await Model.countDocuments();
    const apiFeature = new ApiFeature(Model.find(req.filterObject), req.query)
      .paginate(documentsCount)
      .filter()
      .limitFields()
      .search(modelName)
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeature;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    // Check if document exist
    if (!document) {
      return next(new ApiError(`No document found with the id ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Check if document exist
    if (!document) {
      return next(
        new ApiError(`No document found with the id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete({ _id: id });

    // Check if document exist
    if (!document) {
      return next(new ApiError(`No document found with the id ${id}`, 404));
    }

    res.status(204).send();
  });
