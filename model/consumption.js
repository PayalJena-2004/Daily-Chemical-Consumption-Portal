const mongoose = require('mongoose');

const DailyChemicalSchema = new mongoose.Schema({
  DC_DATE: { type: Date, required: true },
  OPENING_BALANCE: { type: Number },
  RECIVE_QTY: { type: Number },
  CONSUMPTION_QTY: { type: Number },
  CLOSING_BALANCE: { type: Number },
  SAP_BALANCE: { type: Number },
  REMARKS: { type: String },
  USER_ID: { type: Number },
  DATA_INSERT_DATE: { type: Date },
  UPDATE_STATUS: { type: String },
  UPDATE_DATE: { type: Date },
  STATUS: { type: String },

  UNIT_CODE: { type: String, required: true },
  UNIT_NAME: { type: String },
  CHEMICAL_CODE: { type: String, required: true },
  CHEMICAL_NAME: { type: String },
  UOM: { type: String },
  SAP_MAT_CODE: { type: Number },
  STOCK_IN_SAP: { type: Number },
  AVG_DAILY_CONSUMPTION: { type: Number }
});

DailyChemicalSchema.index({ DC_DATE: 1, UNIT_CODE: 1, CHEMICAL_CODE: 1 }, { unique: true });

module.exports = mongoose.model('consumption', DailyChemicalSchema);
