const getStartView = (req, res, next) => {
  res.render('start', {assetpath:'../'});
};

const getProductsView = (req, res, next) => {
  res.render('products', {assetpath:'../', products:req.products, type:req.type});
};

const getProductView = (req, res, next) => {
  res.render('product', {assetpath:'../', product:req.product});
};

//Post
/*const postLogin = (req, res, next) => {
  res.cookie('x_access_token', req.token, { expires: new Date(Date.now() + (60*60*1000)), httpOnly: true, secure: false });
  //req.session.access_token = req.token;

  res.status(200).send({'result':true});
};*/

module.exports = {
  getStartView,
  getProductsView,
  getProductView
}
