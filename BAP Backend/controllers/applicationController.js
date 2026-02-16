const path = require('path');
const pool = require('../db');

const toBool = (v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return ['true', '1', 'yes', 'on'].includes(v.toLowerCase());
  if (typeof v === 'number') return v === 1;
  return null;
};


const getFilePath = (req, key) => {
  const file = req.files?.[key]?.[0];
  if (!file) return null;
  return file.path; 
};


module.exports.submitApplication = async (req, res) => {
  try {
  const userid=req.user.userid; 
  const record_created_by=req.user.userid;
  const name_of_applicant=req.user.name;

  const exist=await pool.query('SELECT id FROM applicant_details WHERE userid=$1', [userid]);
  if(exist.rows.length>0){
    return res.status(400).json({error:'Application already exists for this user'});
  }


    const {
      reg_incorporation,
      license_no,
      reg_office_address,
      corr_office_address,
      gstn_reg_no,
      tax_tan,
      aadhar_auth_aua,
      aadhar_auth_aua_kua,
      board_resolution,
      provision_aadhar,
      category_applicant,
      category_applicant_values,
      record_updated_on,
      record_updated_by, 
      record_status,     
    } = req.body;


    if (!userid) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

      if (!name_of_applicant) {
      return res.status(400).json({
        error: 'name_of_applicant is required',
      });
    }
      if (!record_created_by) {
      return res.status(400).json({
        error: 'record_created_by is required',
      });
    }

    const reg_incorporation_documentpath = getFilePath(req, 'reg_incorporation_documentpath');
    const license_no_documentpath = getFilePath(req, 'license_no_documentpath');
    const gstn_reg_no_documentpath = getFilePath(req, 'gstn_reg_no_documentpath');
    const tax_tan_documentpath = getFilePath(req, 'tax_tan_documentpath');
    const board_resolution_documentpath = getFilePath(req, 'board_resolution_documentpath');
    const provision_aadhar_documentpath = getFilePath(req, 'provision_aadhar_documentpath'); 

    const aadhar_auth_aua_bool = toBool(aadhar_auth_aua);
    const aadhar_auth_aua_kua_bool = toBool(aadhar_auth_aua_kua);

    const text = `
      INSERT INTO applicant_details (
        userid,
        name_of_applicant,
        reg_incorporation,
        reg_incorporation_documentpath,
        license_no,
        license_no_documentpath,
        reg_office_address,
        corr_office_address,
        gstn_reg_no,
        gstn_reg_no_documentpath,
        tax_tan,
        tax_tan_documentpath,
        aadhar_auth_aua,
        aadhar_auth_aua_kua,
        board_resolution,
        board_resolution_documentpath,
        provision_aadhar,
        provision_aadhar_documentpath,
        category_applicant,
        category_applicant_values,
        record_updated_on,
        record_created_by,
        record_updated_by,
        record_status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
      RETURNING id
    `;

    const values = [
      userid,
      name_of_applicant,
      reg_incorporation || null,
      reg_incorporation_documentpath || null,
      license_no || null,
      license_no_documentpath || null,
      reg_office_address || null,
      corr_office_address || null,
      gstn_reg_no || null,
      gstn_reg_no_documentpath || null,
      tax_tan || null,
      tax_tan_documentpath || null,
      aadhar_auth_aua_bool,
      aadhar_auth_aua_kua_bool,
      board_resolution || null,
      board_resolution_documentpath || null,
      provision_aadhar || null,
      provision_aadhar_documentpath || null, 
      category_applicant || null,
      category_applicant_values || null,
      record_updated_on || null,
      record_created_by,
      record_updated_by || null,
      record_status || 'C',
    ];

    const { rows } = await pool.query(text, values);
    return res.status(201).json({
      message: 'Applicant created successfully',
      id: rows[0].id,
    });
  } catch (err) {
    console.error('Create applicant error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } 
};