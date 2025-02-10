import multer from "multer";
import path from "path";
import fs from "fs";

// FILTER FOR FILE TO CHECK FILE TYPE ".jpeg,.jpg,.png"
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error("Only .jpg and .png files are allowed!"), false);
  }
};

// CONFIGURING DISK STORAGE FOR MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("./products")) {
      fs.mkdirSync("./products");
      return cb(null, "./products");
    } else {
      return cb(null, "./products");
    }
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// CONFIGURING UPLOAD MIDDLEWARE AND FILE SIZE "5MB" FILTER FOR MULTER
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("uploaded_file");

// EXPORTING FUNCTION TO CHECK THE VALIDATION FOR THE FILE
export const checkFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(413)
          .json({ message: "File should be smaller than 5MB" });
      }
    } else if (err) {
      if (err.message === "Only .jpg and .png files are allowed!") {
        return res.status(415).json({ message: err.message });
      }
      return res.status(400).json({ message: err.message });
    }

    if (req.file === undefined) {
      return next();
    }

    next();
  });
};
