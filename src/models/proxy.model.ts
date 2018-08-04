import * as mongoose from 'mongoose';

const SchemaM = mongoose.Schema;

const proxySchema = new SchemaM({
  time: {
    type: String,
    default: new Date(),
  },
  ip: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Proxy = mongoose.model('proxy', proxySchema);

export default Proxy;