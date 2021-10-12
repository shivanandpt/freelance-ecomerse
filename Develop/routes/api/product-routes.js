const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({ raw: true });
    await Promise.all(products.map(async (product) => {
      product.category = await Category.findByPk(product.category_id, { raw: true });
      let tags = [];
      const tagsAssociated = await ProductTag.findAll({
        where: {
          product_id: product.id
        },
        raw: true
      });
      await Promise.all(tagsAssociated.map(async (tagAssociated) => {
        const tag = await Tag.findByPk(tagAssociated.tag_id, {
          raw: true
        });
        tags.push(tag);
      }));
      product.tags = tags;
    }))
    return res.send(products);
  } catch (err) {
    return res.send(err);
  }
  
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  let id = parseInt(req.params.id);
  try {
    const product = await Product.findByPk(id, { raw: true });
    product.category = await Category.findByPk(product.category_id, { raw: true });
    let tags = [];
    const tagsAssociated = await ProductTag.findAll({
      where: {
        product_id: product.id
      },
      raw: true
    });
    await Promise.all(tagsAssociated.map(async (tagAssociated) => {
      const tag = await Tag.findByPk(tagAssociated.tag_id, {
        raw: true
      });
      tags.push(tag);
    }));
    product.tags = tags;
    return res.send(product);
  } catch (err) {
    return res.send(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.send(product);
  } catch(err) {
    return res.send(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  // Product.update(req.body, {
  //   where: {
  //     id: req.params.id,
  //   },
  // })
  //   .then((product) => {
  //     // find all associated tags from ProductTag
  //     return ProductTag.findAll({ where: { product_id: req.params.id } });
  //   })
  //   .then((productTags) => {
  //     // get list of current tag_ids
  //     const productTagIds = productTags.map(({ tag_id }) => tag_id);
  //     // create filtered list of new tag_ids
  //     const newProductTags = req.body.tagIds
  //       .filter((tag_id) => !productTagIds.includes(tag_id))
  //       .map((tag_id) => {
  //         return {
  //           product_id: req.params.id,
  //           tag_id,
  //         };
  //       });
  //     // figure out which ones to remove
  //     const productTagsToRemove = productTags
  //       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
  //       .map(({ id }) => id);

  //     // run both actions
  //     return Promise.all([
  //       ProductTag.destroy({ where: { id: productTagsToRemove } }),
  //       ProductTag.bulkCreate(newProductTags),
  //     ]);
  //   })
  //   .then((updatedProductTags) => res.json(updatedProductTags))
  //   .catch((err) => {
  //     // console.log(err);
  //     res.status(400).json(err);
  //   });

  let id = parseInt(req.params.id);
  try {
    const product = await Product.update(req.body, {
      where: {
        id: id
      }
    });
    return res.send([])
  } catch (err) {
    return res.send(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  let id = parseInt(req.params.id);
  try {
    await Product.destroy({
      where: {
        id: id
      }
    });
    return res.send({});
  } catch(err) {
    return res.send(err);
  }
});

module.exports = router;
