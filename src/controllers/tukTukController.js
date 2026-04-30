const {
  createTukTukRecord,
  getTukTukRecords,
  getTukTukRecordById,
  updateTukTukRecord,
  deleteTukTukRecord
} = require('../services/tukTukService');

const createTukTuk = async (req, res) => {
  try {
    const tukTuk = await createTukTukRecord(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tuk-tuk created successfully',
      data: tukTuk
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to create tuk-tuk'
    });
  }
};

const getAllTukTuks = async (req, res) => {
  try {
    const tukTuks = await getTukTukRecords(req.query);

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuks retrieved successfully',
      count: tukTuks.length,
      data: tukTuks
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve tuk-tuks'
    });
  }
};

const getTukTukById = async (req, res) => {
  try {
    const tukTuk = await getTukTukRecordById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuk retrieved successfully',
      data: tukTuk
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve tuk-tuk'
    });
  }
};

const updateTukTuk = async (req, res) => {
  try {
    const updatedTukTuk = await updateTukTukRecord(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuk updated successfully',
      data: updatedTukTuk
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to update tuk-tuk'
    });
  }
};

const deleteTukTuk = async (req, res) => {
  try {
    await deleteTukTukRecord(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuk deleted successfully'
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to delete tuk-tuk'
    });
  }
};

module.exports = {
  createTukTuk,
  getAllTukTuks,
  getTukTukById,
  updateTukTuk,
  deleteTukTuk
};