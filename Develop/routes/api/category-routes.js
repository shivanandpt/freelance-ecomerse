const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({ raw: true });
    await Promise.all(categories.map(async (category) => {
      category.products = await Product.findAll({
        where: {
          category_id: category.id
        },
        raw: true
      });
      
      return category;
    }));
    console.log(categories);
    return res.send(categories);

  } catch(err) {
    return res.send(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  let id =  parseInt(req.params.id);
  try {
    const category = await Category.findByPk(id,{  raw: true });
    category.products = await Product.findAll({
      where: {
        category_id: category.id
      },
      raw: true
    });
    res.send(category);
  } catch (err) {
    return res.send(err);
  }
 
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const category = await Category.create(req.body);
    return res.send(category);
  } catch(err) {
    return res.send(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  let id = req.params.id;
  try {
    const category = await Category.update(req.body, {
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
  // delete a category by its `id` value
  let id = req.params.id;
  try {
    await Category.destroy({
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
