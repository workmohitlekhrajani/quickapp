import mongoose from "mongoose";

const storeModel = mongoose.Schema({
  
  shop: {
    type: String,
    default:null,
    required: true,
  },
  blog: {
    type: Boolean,
    default:false,
    required: true,
  },
  collection_script: {
    type: Boolean,
    default:false,
    required: true,
  },
  page: {
    type: Boolean,
    default:false,
    required: true,
  },
  product: {
    type: Boolean,
    default:false,
    required: true,
  },
  homepage: {
    type: Boolean,
    default:false,
    required: true,
  },
  breadcrumb: {
    type: Boolean,
    default:false,
    required: true,
  },
  createdAt:{
    type:Date,
    default:new Date()
  }
});

const storeModelData = mongoose.model('store_schema',storeModel)

export default storeModelData;
