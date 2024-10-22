const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeatures");

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
