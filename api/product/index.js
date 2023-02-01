const express = require("express"),
    router = express.Router();

const { Op } = require("sequelize");
const ProductModel = require("./model");

//get all
router.get("/", async (req, res, next) => {
    const query = {};
    try {
        if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` };
        if (req.query.category)
            query.category = { [Op.iLike]: `${req.query.category}%` };

        const products = await ProductModel.findAll({
            where: { ...query },
            attributes: [
                "name",
                "category",
                "description",
                "image",
                "price",
                "createdAt",
            ],
        });

        res.send(products);
    } catch (e) {
        console.log(e);
        next(e);
    }
});
//get single
router.get("/:product_id", async (req, res) => {
    const { product_id } = req.params;

    try {
        const product = await ProductModel.findByPk(product_id, {
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (product) {
            res.send(product);
        } else {
            next(new Error("Product not found"));
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
});
//add product
router.post("/", async (req, res) => {
    const data = req.body;
    try {
        const { id } = await ProductModel.create(data);
        res.status(201).send({ id });
    } catch (e) {
        console.log(e);
        next(e);
    }
});
//edit product
router.put("/:product_id", async (req, res) => {
    const { product_id } = req.params;

    try {
        const [numberOfUpdatedRows, updatedRecords] = await ProductModel.update(
            req.body,
            {
                where: { id: product_id },
                returning: true,
            }
        );

        if (numberOfUpdatedRows === 1) {
            res.send(updatedRecords[0]);
        } else {
            next(new Error("Product not found"));
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
});
//delete product
router.delete("/:product_id", async (req, res) => {
    const { product_id } = req.params;
    try {
        const numberOfDeletedRows = await ProductModel.destroy({
            where: { id: product_id },
        });

        if (numberOfDeletedRows === 1) {
            res.status(204).send();
        } else {
            next(new Error("Product not found"));
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
});

module.exports = router;
