const isEmail = require('isemail');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.checkEmail = (str) => {
  const email = str ? str : '';
  return isEmail.validate(email) ? email : null;
}

module.exports.genToken = (user) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXP }
  );

  return token;
}

module.exports.checkToken = (token) => {
  try {
    const check = jwt.verify(token, process.env.JWT_SECRET);
    return check;
  } catch (err) {
    throw err;
  }
}

module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize),
        )
    : results.slice(0, pageSize);
};
