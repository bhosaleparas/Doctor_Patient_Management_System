import cookieParser from 'cookie-parser';

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];
//   console.log(req);
//   console.log(header);

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    // console.log(token);
    next();
  } else {
    res.sendStatus(403);
  }
};



export {checkToken};