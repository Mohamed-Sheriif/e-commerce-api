const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // 2) Memory Storage Engine
  const multerStorage = multer.memoryStorage();

  // Multer Filter
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (imageName) => multerOptions().single(imageName);

exports.uploadMultibleImages = (arrayOfields) =>
  multerOptions().fields(arrayOfields);
