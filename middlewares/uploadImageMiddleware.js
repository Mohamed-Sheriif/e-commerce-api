const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (imageName) => {
  // 1) Disck Storage Engine
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`);
  //   },
  // });

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

  return upload.single(imageName);
};
