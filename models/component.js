const mongoose = require('mongoose')

const ComponentSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  // display properties
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  rectangle: {
    type: [Number]
  },
  zIndex: {
    type: Number
  },
  deleted: {
    type: Boolean
  },

  // update timestamps
  lastUpdated: {
    type: Number
  },
  positionLastUpdated: {
    type: Number
  },
  sizeLastUpdated: {
    type: Number
  },
  contentLastUpdated: {
    type: Number
  },
  zIndexLastUpdated: {
    type: Number
  },
  deletionLastUpdated: {
    type: Number
  }
})

const Component = mongoose.model('Component', ComponentSchema)

module.exports = exports = Component
