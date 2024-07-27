const ProductService = require("../services/product-service");

const UserAuth = require("./middlewares/auth");
const { PublishCustomerEvents, PublishShoppingEvents } = require("../utils");
module.exports = (app) => {
  const service = new ProductService();

  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      //customer api ye gönderilecek payload hazırla
      const { data } = service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: 1 },
        "ADD_TO_WISHLIST"
      );
      //customer api yına istek listesine ürünü eklemsi için haber gönder
      PublishCustomerEvents(data);

      return res.status(200).json(data.data.product);
    } catch (err) {
      console.log("hataaaa", err);
    }
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_WISHLIST"
      );
      //customer api na favori çıkarması için haber gönder
      PublishCustomerEvents(data);
      return res.status(200).json(data.data.product);
    } catch (err) {
      next(err);
    }
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      //haberi hazırla
      const { data } = service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        "ADD_TO_CARD"
      );

      //haber gönder
      PublishCustomerEvents(data);
      //shopping api ya sepete eklenme haberi gönder
      PublishShoppingEvents(data);
      //return edilecek veriyi belirle
      const response = {
        product: data.data.product,
        unit: data.data.qty,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      //haberi hazırla
      const { data } = service.GetProductPayload(
        _id,
        { productId: req.params._id },
        "REMOVE_FROM_CARD"
      );

      //haber gönder
      PublishCustomerEvents(data);
      //shopping api ya sepete eklenme haberi gönder
      PublishShoppingEvents(data);
      //return edilecek veriyi belirle
      const response = {
        product: data.data.product,
        unit: data.data.qty,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
