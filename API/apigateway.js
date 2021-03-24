var express = require('express')
const mds = require('markdown-serve');
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// api gateway

// api gateway
router.get('/', function (req, res) {
  res.render('./gateway/index', {})
})

router.get('/:action', function (req, res) {
  const apiaction = req.params.action || ""
  const apioptions = req.params.options || ""
  res.render('./gateway/'+ apiaction || "index", { apiaction: apiaction, apioptions: apioptions})
})

module.exports = router