const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const tags = await Tag.findAll({ raw: true });
  
  await Promise.all(tags.map(async (tag) => {
    let products = [];
    const productsAssociated = await ProductTag.findAll({
      where: {
        tag_id: tag.id
      },
      raw: true
    });
    await Promise.all(productsAssociated.map(async (productAssociated) => {
      const product = await Product.findByPk(productAssociated.product_id, {
        raw: true
      });
      products.push(product);
    }))
    tag.products = products;
    return tag;
  }))
  return res.send(tags);
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  let id = parseInt(req.params.id);
  try {
    const tag = await Tag.findByPk(id, { raw: true});
    const productsAssociated = await ProductTag.findAll({
      where: {
        tag_id: tag.id
      },
      raw: true
    });
    let products = [];
     await Promise.all(productsAssociated.map(async (productAssociated) => {
      let product = await Product.findByPk(productAssociated.product_id, {
        raw: true
      });
      products.push(product);
    }));
    tag.products = products;
    res.send(tag);
  } catch (err) {
    return res.send(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create(req.body);
    return res.send(tag);
  } catch(err) {
    return res.send(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  let id = parseInt(req.params.id);
  try {
    const tag = await Tag.update(req.body, {
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
  // delete on tag by its `id` value
  let id = parseInt(req.params.id);
  try {
    await Tag.destroy({
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
