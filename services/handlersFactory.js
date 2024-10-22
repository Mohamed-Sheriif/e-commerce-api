const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeatures");

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
