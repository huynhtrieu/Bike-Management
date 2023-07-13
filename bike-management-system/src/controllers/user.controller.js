const { userService } = require("../services");
const httpStatus = require("http-status");
const excel = require("exceljs");
const { WorkSheet } = require("../constanst");

const getProfile = (req, res) => {
  return res.send(req.user);
};

const getAllProfile = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };

  const { countProfile, listProfile } = await userService.getAllUser(
    pagination
  );

  return res.send({ users: listProfile, count: countProfile });
};

const downloadExcel = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };
  const allUsers = await userService.getAllUser(pagination);
  const mapDataFordownloadExcel = allUsers.listProfile.map((user) => ({
    email: user.email,
    name: user.name,
    role: user.roleId.name,
    phoneNumber: user.phoneNumber || "null",
    address: user.address || "null",
    birthDate: user.birthDate || "null",
  }));

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet(WorkSheet.USER);

  worksheet.columns = [
    { header: "email", key: "email", width: 15 },
    { header: "name", key: "name", width: 15 },
    { header: "role", key: "role", width: 15 },
    { header: "phoneNumber", key: "phoneNumber", width: 15 },
    { header: "address", key: "address", width: 15 },
    { header: "birthDate", key: "birthDate", width: 15 },
  ];
  // worksheet.addRows(mapDataFordownloadExcel)
  mapDataFordownloadExcel.forEach((dataExcel) => {
    worksheet.addRow(dataExcel);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=user.xlsx");

  // Send the workbook as a response
  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error generating Excel file");
    });
};

const updateProfile = async (req, res) => {
  const updatedUser = await userService.updateProfile(
    req.user,
    req.body,
    req.file
  );
  return res.send(updatedUser);
};

const updatePassword = async (req, res) => {
  const { isError, errorMessage } = await userService.updatePassword(
    req.user,
    req.body
  );
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  return res.send({ message: "OK" });
};

const deleteUser = async (req, res) => {
  const { isError, errorMessage, result } = await userService.deleteUser(
    req.params.id
  );

  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  return res.send({ message: "OK" });
};

const searchUser = async (req, res) => {
  const { isError, errorMessage, result } = await userService.searchUser(
    req.query
  );
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: errorMessage,
    });
  }

  return res.send({ ...result });
};

module.exports = {
  getProfile,
  getAllProfile,
  downloadExcel,
  updateProfile,
  updatePassword,
  deleteUser,
  searchUser,
};
