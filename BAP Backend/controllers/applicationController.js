const path = require('path');
const pool = require('../db');
const prisma = require('../lib/prisma');


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
    const userid = req.user?.userid;
    const record_created_by = req.user?.userid;
    const name_of_applicant = req.user?.name;

    if (!userid) return res.status(400).json({ error: 'User ID is required' });
    if (!name_of_applicant) return res.status(400).json({ error: 'name_of_applicant is required' });
    if (!record_created_by) return res.status(400).json({ error: 'record_created_by is required' });

    const reg_incorporation_documentpath = getFilePath(req, 'reg_incorporation_documentpath');
    const license_no_documentpath = getFilePath(req, 'license_no_documentpath');
    const gstn_reg_no_documentpath = getFilePath(req, 'gstn_reg_no_documentpath');
    const tax_tan_documentpath = getFilePath(req, 'tax_tan_documentpath');
    const board_resolution_documentpath = getFilePath(req, 'board_resolution_documentpath');
    const provision_aadhar_documentpath = getFilePath(req, 'provision_aadhar_documentpath');
    const declaration_asa_documentpath = getFilePath(req, 'declaration_asa_documentpath');
    const applicant_conf_uidai_info_policy_documentpath = getFilePath(req, 'applicant_conf_uidai_info_policy_documentpath');
    const applicant_conf_uidai_model_doc_documentpath = getFilePath(req, 'applicant_conf_uidai_model_doc_documentpath');
    const declaration_understanding_documentpath = getFilePath(req, 'declaration_understanding_documentpath');

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

    const aadhar_auth_aua_bool = toBool(aadhar_auth_aua);
    const aadhar_auth_aua_kua_bool = toBool(aadhar_auth_aua_kua);

    const cd = req.body;
    const nameAsaInput = req.body.name_asa;

    let asa_name_ids = [];
    let asa_declaration_id = null;
    let applicant_details_id = null;
    let contact_details_id = null;
    let authentication_details_id = null;
    let declaration_understandings_id = null;

    const result = await prisma.$transaction(async (tx) => {
      const exist = await tx.applicant_details.findFirst({
        where: { userid: userid },
        select: { id: true },
      });
      if (exist) {
        const err = new Error('Application already exists for this user');
        err.code = 'DUPLICATE';
        throw err;
      }

      const applicantInsert = await tx.applicant_details.create({
        data: {
          userid,
          name_of_applicant,
          reg_incorporation: reg_incorporation || null,
          reg_incorporation_documentpath: reg_incorporation_documentpath || null,
          license_no: license_no || null,
          license_no_documentpath: license_no_documentpath || null,
          reg_office_address: reg_office_address || null,
          corr_office_address: corr_office_address || null,
          gstn_reg_no: gstn_reg_no || null,
          gstn_reg_no_documentpath: gstn_reg_no_documentpath || null,
          tax_tan: tax_tan || null,
          tax_tan_documentpath: tax_tan_documentpath || null,
          aadhar_auth_aua: aadhar_auth_aua_bool,
          aadhar_auth_aua_kua: aadhar_auth_aua_kua_bool,
          board_resolution: board_resolution || null,
          board_resolution_documentpath: board_resolution_documentpath || null,
          provision_aadhar: provision_aadhar || null,
          provision_aadhar_documentpath: provision_aadhar_documentpath || null,
          category_applicant: category_applicant || null,
          category_applicant_values: category_applicant_values || null,
          record_updated_on: record_updated_on || null,
          record_created_by,
          record_updated_by: record_updated_by || null,
          record_status: record_status || 'C',
        },
        select: { id: true },
      });
      applicant_details_id = String(applicantInsert.id);

      const contactInsert = await tx.contact_details.create({
        data: {
          userid,
          mpoc_name: cd.mpoc_name || null,
          mpoc_full_designation: cd.mpoc_full_designation || null,
          mpoc_email_address: cd.mpoc_email_address || null,
          mpoc_mobile_number: cd.mpoc_mobile_number || null,
          mpoc_telephone_number: cd.mpoc_telephone_number || null,
          person_authorised_name: cd.person_authorised_name || null,
          person_authorised_full_designation: cd.person_authorised_full_designation || null,
          person_authorised_email_address: cd.person_authorised_email_address || null,
          person_authorised_mobile_number: cd.person_authorised_mobile_number || null,
          person_authorised_telephone_number: cd.person_authorised_telephone_number || null,
          personnel_name: cd.personnel_name || null,
          personnel_full_designation: cd.personnel_full_designation || null,
          personnel_email_address: cd.personnel_email_address || null,
          personnel_mobile_number: cd.personnel_mobile_number || null,
          personnel_telephone_number: cd.personnel_telephone_number || null,
          tpoc_name: cd.tpoc_name || null,
          tpoc_full_designation: cd.tpoc_full_designation || null,
          tpoc_email_address: cd.tpoc_email_address || null,
          tpoc_mobile_number: cd.tpoc_mobile_number || null,
          tpoc_telephone_number: cd.tpoc_telephone_number || null,
          cxo_name: cd.cxo_name || null,
          cxo_full_designation: cd.cxo_full_designation || null,
          cxo_email_address: cd.cxo_email_address || null,
          cxo_mobile_number: cd.cxo_mobile_number || null,
          cxo_telephone_number: cd.cxo_telephone_number || null,
          other_personnel_name: cd.other_personnel_name || null,
          other_personnel_full_designation: cd.other_personnel_full_designation || null,
          other_personnel_email_address: cd.other_personnel_email_address || null,
          other_personnel_mobile_number: cd.other_personnel_mobile_number || null,
          other_personnel_telephone_number: cd.other_personnel_telephone_number || null,
          infrastructure_details_mpoc_tpoc_name: cd.infrastructure_details_mpoc_tpoc_name || null,
          infrastructure_details_email_address: cd.infrastructure_details_email_address || null,
          infrastructure_details_mobile_no: cd.infrastructure_details_mobile_no || null,
          infrastructure_details_address: cd.infrastructure_details_address || null,
          infrastructure_details_district: cd.infrastructure_details_district || null,
          infrastructure_details_state: cd.infrastructure_details_state || null,
          infrastructure_details_pin_code: cd.infrastructure_details_pin_code || null,
          data_centre_mpoc_tpoc_name: cd.data_centre_mpoc_tpoc_name || null,
          data_centre_email_address: cd.data_centre_email_address || null,
          data_centre_mobile_number: cd.data_centre_mobile_number || null,
          data_centre_address: cd.data_centre_address || null,
          data_centre_district: cd.data_centre_district || null,
          data_centre_state: cd.data_centre_state || null,
          data_centre_pin_code: cd.data_centre_pin_code || null,
          data_recovery_centre_mpoc_tpoc_name: cd.data_recovery_centre_mpoc_tpoc_name || null,
          data_recovery_centre_email_address: cd.data_recovery_centre_email_address || null,
          data_recovery_centre_mobile_number: cd.data_recovery_centre_mobile_number || null,
          data_recovery_centre_address: cd.data_recovery_centre_address || null,
          data_recovery_centre_district: cd.data_recovery_centre_district || null,
          data_recovery_centre_state: cd.data_recovery_centre_state || null,
          data_recovery_centre_pin_code: cd.data_recovery_centre_pin_code || null,
          grievance_redressal_websiteurl: cd.grievance_redressal_websiteurl || null,
          grievance_redressal_email_address: cd.grievance_redressal_email_address || null,
          grievance_redressal_helpdesk_number: cd.grievance_redressal_helpdesk_number || null,
          record_updated_on: cd.record_updated_on || null,
          record_created_by,
          record_updated_by: cd.record_updated_by || null,
          record_status: cd.record_status || 'C',
        },
        select: { id: true },
      });
      contact_details_id = String(contactInsert.id);

      const nameAsList = Array.isArray(nameAsaInput)
        ? nameAsaInput
        : (nameAsaInput ? [nameAsaInput] : []);
      for (const name_asa of nameAsList) {
        if (!name_asa) continue;
        const ins = await tx.applicant_asa_name.create({
          data: {
            userid,
            name_asa,
            record_updated_on: req.body.record_updated_on || null,
            record_created_by,
            record_updated_by: req.body.record_updated_by || null,
            record_status: req.body.record_status || 'C',
          },
          select: { id: true },
        });
        asa_name_ids.push(String(ins.id));
      }

      const declaration_asa = req.body.declaration_asa || null;
      if (declaration_asa || declaration_asa_documentpath) {
        const insDec = await tx.applicant_asa_declaration.create({
          data: {
            userid,
            declaration_asa,
            declaration_asa_documentpath: declaration_asa_documentpath || null,
            record_updated_on: req.body.record_updated_on || null,
            record_created_by,
            record_updated_by: req.body.record_updated_by || null,
            record_status: req.body.record_status || 'C',
          },
          select: { id: true },
        });
        asa_declaration_id = String(insDec.id);
      }

      const auth_financial_transaction_bool = toBool(req.body.auth_financial_transaction);
      const applicant_conf_uidai_info_policy_bool = toBool(req.body.applicant_conf_uidai_info_policy);
      const applicant_conf_uidai_model_doc_bool = toBool(req.body.applicant_conf_uidai_model_doc);

      const authInsert = await tx.applicant_authentication_details.create({
        data: {
          userid,
          territorial_use_auth_facility: req.body.territorial_use_auth_facility || null,
          territorial_use_auth_facility_value: req.body.territorial_use_auth_facility_value || null,
          auth_financial_transaction: auth_financial_transaction_bool,
          device_form_factor: req.body.device_form_factor || null,
          auth_assist_user: req.body.auth_assist_user || null,
          mode_of_authentication: req.body.mode_of_authentication || null,
          connectivity_support: req.body.connectivity_support || null,
          connectivity_support_value: req.body.connectivity_support_value || null,
          applicant_conf_uidai_info_policy: applicant_conf_uidai_info_policy_bool,
          applicant_conf_uidai_info_policy_documentpath:
            applicant_conf_uidai_info_policy_documentpath || null,
          applicant_conf_uidai_model_doc: applicant_conf_uidai_model_doc_bool,
          applicant_conf_uidai_model_doc_documentpath:
            applicant_conf_uidai_model_doc_documentpath || null,
          record_updated_on: req.body.record_updated_on || null,
          record_created_by,
          record_updated_by: req.body.record_updated_by || null,
          record_status: req.body.record_status || 'C',
        },
        select: { id: true },
      });
      authentication_details_id = String(authInsert.id);

      if (declaration_understanding_documentpath) {
        const insDU = await tx.applicant_declaration_understandings.create({
          data: {
            userid,
            declaration_understanding_documentpath,
            record_updated_on: req.body.record_updated_on || null,
            record_created_by,
            record_updated_by: req.body.record_updated_by || null,
            record_status: req.body.record_status || 'C',
          },
          select: { id: true },
        });
        declaration_understandings_id = String(insDU.id);
      }

      return {
        applicant_details_id,
        contact_details_id,
        asa_name_ids,
        asa_declaration_id,
        authentication_details_id,
        declaration_understandings_id,
      };
    });

    return res.status(201).json({
      message: 'Application and related details created successfully',
      applicant_details_id: result.applicant_details_id,
      contact_details_id: result.contact_details_id,
      asa_name_ids: result.asa_name_ids,
      asa_declaration_id: result.asa_declaration_id,
      authentication_details_id: result.authentication_details_id,
      declaration_understandings_id: result.declaration_understandings_id,
    });
  } catch (err) {
    if (err?.code === 'DUPLICATE') {
      return res.status(400).json({ error: 'Application already exists for this user' });
    }
    console.error('Create applicant (multi-table) error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports.getApplication = async (req, res) => {
  try {
    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ error: 'Unauthorized' });

    const [
      applicant_details,
      contact_details,
      applicant_asa_name,
      applicant_asa_declaration,
      applicant_authentication_details,
      applicant_declaration_understandings,
    ] = await Promise.all([
      prisma.applicant_details.findFirst({
        where: { userid },
        orderBy: { id: 'desc' },
      }),
      prisma.contact_details.findFirst({
        where: { userid },
        orderBy: { id: 'desc' },
      }),
      prisma.applicant_asa_name.findMany({
        where: { userid },
        orderBy: { id: 'asc' },
      }),
      prisma.applicant_asa_declaration.findFirst({
        where: { userid },
        orderBy: { id: 'desc' },
      }),
      prisma.applicant_authentication_details.findFirst({
        where: { userid },
        orderBy: { id: 'desc' },
      }),
      prisma.applicant_declaration_understandings.findFirst({
        where: { userid },
        orderBy: { id: 'desc' },
      }),
    ]);

    const data = {
      applicant_details,
      contact_details,
      applicant_asa_name,
      applicant_asa_declaration,
      applicant_authentication_details,
      applicant_declaration_understandings,
    };

    const hasAny =
      data.applicant_details ||
      data.contact_details ||
      (data.applicant_asa_name && data.applicant_asa_name.length > 0) ||
      data.applicant_asa_declaration ||
      data.applicant_authentication_details ||
      data.applicant_declaration_understandings;

    if (!hasAny) {
      return res.status(404).json({ error: 'No application found for this user' });
    }

    const finalData = JSON.parse(
      JSON.stringify(
        {
          message: 'Application fetched successfully',
          userid,
          ...data,
        },
        (_, v) => (typeof v === 'bigint' ? v.toString() : v)
      )
    );
    
    return res.status(200).json(finalData);
  } 
  catch (err) {
    console.error('Fetch application error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      where: err.where,
      stack: err.stack,
    });
    return res.status(500).json({ error: 'Internal server error at getApplication' });
  }
};



module.exports.updateApplication = async (req, res) => {
  const hasProp = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  const normalize = (v) => (v === '' || typeof v === 'undefined' ? null : v);

  const toBool = (v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v === 1;
    if (typeof v === 'string') {
      const s = v.toLowerCase();
      return s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 'on';
    }
    return false;
  };

  try {
    const userid = req.user?.userid;
    const record_created_by = req.user?.userid;

    if (!userid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const existingApplicant = await prisma.applicant_details.findFirst({
      where: { userid }
    });
    if (!existingApplicant) {
      return res.status(404).json({ error: 'No application found for this user' });
    }


    const result = await prisma.$transaction(async (tx) => {
      const reg_incorporation_documentpath   = getFilePath(req, 'reg_incorporation_documentpath');
      const license_no_documentpath          = getFilePath(req, 'license_no_documentpath');
      const gstn_reg_no_documentpath         = getFilePath(req, 'gstn_reg_no_documentpath');
      const tax_tan_documentpath             = getFilePath(req, 'tax_tan_documentpath');
      const board_resolution_documentpath    = getFilePath(req, 'board_resolution_documentpath');
      const provision_aadhar_documentpath    = getFilePath(req, 'provision_aadhar_documentpath');

      const applicantDetailsAllowed = [
        'reg_incorporation',
        'reg_incorporation_documentpath',
        'license_no',
        'license_no_documentpath',
        'reg_office_address',
        'corr_office_address',
        'gstn_reg_no',
        'gstn_reg_no_documentpath',
        'tax_tan',
        'tax_tan_documentpath',
        'aadhar_auth_aua',
        'aadhar_auth_aua_kua',
        'board_resolution',
        'board_resolution_documentpath',
        'provision_aadhar',
        'provision_aadhar_documentpath',
        'category_applicant',
        'category_applicant_values',
        'record_updated_on',
        'record_updated_by',
        'record_status',
      ];

      const applicantProvided = {};
      for (const k of [
        'reg_incorporation',
        'license_no',
        'reg_office_address',
        'corr_office_address',
        'gstn_reg_no',
        'tax_tan',
        'board_resolution',
        'provision_aadhar',
        'category_applicant',
        'category_applicant_values',
        'record_updated_on',
        'record_updated_by',
        'record_status',
      ]) {
        if (hasProp(req.body, k)) applicantProvided[k] = normalize(req.body[k]);
      }
      if (hasProp(req.body, 'aadhar_auth_aua')) {
        applicantProvided.aadhar_auth_aua = toBool(req.body.aadhar_auth_aua);
      }
      if (hasProp(req.body, 'aadhar_auth_aua_kua')) {
        applicantProvided.aadhar_auth_aua_kua = toBool(req.body.aadhar_auth_aua_kua);
      }
      if (reg_incorporation_documentpath) applicantProvided.reg_incorporation_documentpath = reg_incorporation_documentpath;
      if (license_no_documentpath) applicantProvided.license_no_documentpath = license_no_documentpath;
      if (gstn_reg_no_documentpath) applicantProvided.gstn_reg_no_documentpath = gstn_reg_no_documentpath;
      if (tax_tan_documentpath) applicantProvided.tax_tan_documentpath = tax_tan_documentpath;
      if (board_resolution_documentpath) applicantProvided.board_resolution_documentpath = board_resolution_documentpath;
      if (provision_aadhar_documentpath) applicantProvided.provision_aadhar_documentpath = provision_aadhar_documentpath;

      let applicant_details_id = existingApplicant.id;
      if (Object.keys(applicantProvided).length > 0) {
        const updated = await tx.applicant_details.update({
          where: { id: existingApplicant.id }, 
          data: applicantProvided,
          select: { id: true }
        });
        applicant_details_id = updated.id;
      }

      const cd = req.body;
      const contactAllowed = [
        'mpoc_name', 'mpoc_full_designation', 'mpoc_email_address', 'mpoc_mobile_number', 'mpoc_telephone_number',
        'person_authorised_name', 'person_authorised_full_designation', 'person_authorised_email_address',
        'person_authorised_mobile_number', 'person_authorised_telephone_number',
        'personnel_name', 'personnel_full_designation', 'personnel_email_address', 'personnel_mobile_number', 'personnel_telephone_number',
        'tpoc_name', 'tpoc_full_designation', 'tpoc_email_address', 'tpoc_mobile_number', 'tpoc_telephone_number',
        'cxo_name', 'cxo_full_designation', 'cxo_email_address', 'cxo_mobile_number', 'cxo_telephone_number',
        'other_personnel_name', 'other_personnel_full_designation', 'other_personnel_email_address',
        'other_personnel_mobile_number', 'other_personnel_telephone_number',
        'infrastructure_details_mpoc_tpoc_name', 'infrastructure_details_email_address', 'infrastructure_details_mobile_no',
        'infrastructure_details_address', 'infrastructure_details_district', 'infrastructure_details_state', 'infrastructure_details_pin_code',
        'data_centre_mpoc_tpoc_name', 'data_centre_email_address', 'data_centre_mobile_number', 'data_centre_address',
        'data_centre_district', 'data_centre_state', 'data_centre_pin_code',
        'data_recovery_centre_mpoc_tpoc_name', 'data_recovery_centre_email_address', 'data_recovery_centre_mobile_number',
        'data_recovery_centre_address', 'data_recovery_centre_district', 'data_recovery_centre_state', 'data_recovery_centre_pin_code',
        'grievance_redressal_websiteurl', 'grievance_redressal_email_address', 'grievance_redressal_helpdesk_number',
        'record_updated_on', 'record_updated_by', 'record_status',
      ];
      const contactProvided = {};
      for (const k of contactAllowed) {
        if (hasProp(cd, k)) contactProvided[k] = normalize(cd[k]);
      }

      const existingContact = await tx.contact_details.findFirst({ where: { userid } });
      let contact_details_id = existingContact?.id ?? null;

      if (!existingContact) {
        if (Object.keys(contactProvided).length > 0) {
          const created = await tx.contact_details.create({
            data: { userid, record_created_by, record_status: 'C' },
            select: { id: true }
          });
          contact_details_id = created.id;
        }
      }

      if (Object.keys(contactProvided).length > 0) {
        if (contact_details_id) {
          await tx.contact_details.update({
            where: { id: contact_details_id },
            data: contactProvided,
            select: { id: true }
          });
        } else {
          const created = await tx.contact_details.create({
            data: { userid, record_created_by, record_status: 'C', ...contactProvided },
            select: { id: true }
          });
          contact_details_id = created.id;
        }
      }


      let asa_name_ids = [];
      const nameAsaInput = req.body.name_asa;
      if (typeof nameAsaInput !== 'undefined') {
        await tx.applicant_asa_name.deleteMany({ where: { userid } });

        const names = Array.isArray(nameAsaInput) ? nameAsaInput : [nameAsaInput];
        for (const name_asa of names) {
          const value = normalize(name_asa);
          if (!value) continue;
          const created = await tx.applicant_asa_name.create({
            data: {
              userid,
              name_asa: value,
              record_updated_on: normalize(req.body.record_updated_on),
              record_created_by,
              record_updated_by: normalize(req.body.record_updated_by),
              record_status: normalize(req.body.record_status) || 'C',
            },
            select: { id: true }
          });
          asa_name_ids.push(created.id);
        }
      } else {
        const existingNames = await tx.applicant_asa_name.findMany({
          where: { userid },
          select: { id: true }
        });
        asa_name_ids = existingNames.map(r => r.id);
      }


      const declaration_asa_documentpath = getFilePath(req, 'declaration_asa_documentpath');
      const declaration_asa_provided = hasProp(req.body, 'declaration_asa') || !!declaration_asa_documentpath;

      let asa_declaration_id = null;
      if (declaration_asa_provided) {
        const existingDecl = await tx.applicant_asa_declaration.findFirst({ where: { userid } });
        const decProvided = {};
        if (hasProp(req.body, 'declaration_asa')) decProvided.declaration_asa = normalize(req.body.declaration_asa);
        if (declaration_asa_documentpath) decProvided.declaration_asa_documentpath = declaration_asa_documentpath;
        if (hasProp(req.body, 'record_updated_on')) decProvided.record_updated_on = normalize(req.body.record_updated_on);
        if (hasProp(req.body, 'record_updated_by')) decProvided.record_updated_by = normalize(req.body.record_updated_by);
        if (hasProp(req.body, 'record_status')) decProvided.record_status = normalize(req.body.record_status);

        if (existingDecl) {
          if (Object.keys(decProvided).length > 0) {
            const upd = await tx.applicant_asa_declaration.update({
              where: { id: existingDecl.id },
              data: decProvided,
              select: { id: true }
            });
            asa_declaration_id = upd.id;
          } else {
            asa_declaration_id = existingDecl.id;
          }
        } else {
          const created = await tx.applicant_asa_declaration.create({
            data: {
              userid,
              declaration_asa: normalize(req.body.declaration_asa),
              declaration_asa_documentpath: declaration_asa_documentpath || null,
              record_updated_on: normalize(req.body.record_updated_on),
              record_created_by,
              record_updated_by: normalize(req.body.record_updated_by),
              record_status: normalize(req.body.record_status) || 'C',
            },
            select: { id: true }
          });
          asa_declaration_id = created.id;
        }
      } else {
        const decExisting = await tx.applicant_asa_declaration.findFirst({
          where: { userid },
          select: { id: true }
        });
        asa_declaration_id = decExisting?.id || null;
      }


      const applicant_conf_uidai_info_policy_documentpath = getFilePath(req, 'applicant_conf_uidai_info_policy_documentpath');
      const applicant_conf_uidai_model_doc_documentpath   = getFilePath(req, 'applicant_conf_uidai_model_doc_documentpath');

      const authAllowed = [
        'territorial_use_auth_facility',
        'territorial_use_auth_facility_value',
        'auth_financial_transaction',
        'device_form_factor',
        'auth_assist_user',
        'mode_of_authentication',
        'connectivity_support',
        'connectivity_support_value',
        'applicant_conf_uidai_info_policy',
        'applicant_conf_uidai_info_policy_documentpath',
        'applicant_conf_uidai_model_doc',
        'applicant_conf_uidai_model_doc_documentpath',
        'record_updated_on',
        'record_updated_by',
        'record_status',
      ];

      const authProvided = {};
      for (const k of [
        'territorial_use_auth_facility',
        'territorial_use_auth_facility_value',
        'device_form_factor',
        'auth_assist_user',
        'mode_of_authentication',
        'connectivity_support',
        'connectivity_support_value',
        'record_updated_on',
        'record_updated_by',
        'record_status',
      ]) {
        if (hasProp(req.body, k)) authProvided[k] = normalize(req.body[k]);
      }
      if (hasProp(req.body, 'auth_financial_transaction')) {
        authProvided.auth_financial_transaction = toBool(req.body.auth_financial_transaction);
      }
      if (hasProp(req.body, 'applicant_conf_uidai_info_policy')) {
        authProvided.applicant_conf_uidai_info_policy = toBool(req.body.applicant_conf_uidai_info_policy);
      }
      if (hasProp(req.body, 'applicant_conf_uidai_model_doc')) {
        authProvided.applicant_conf_uidai_model_doc = toBool(req.body.applicant_conf_uidai_model_doc);
      }
      if (applicant_conf_uidai_info_policy_documentpath) {
        authProvided.applicant_conf_uidai_info_policy_documentpath = applicant_conf_uidai_info_policy_documentpath;
      }
      if (applicant_conf_uidai_model_doc_documentpath) {
        authProvided.applicant_conf_uidai_model_doc_documentpath = applicant_conf_uidai_model_doc_documentpath;
      }

      const existingAuth = await tx.applicant_authentication_details.findFirst({ where: { userid } });
      let authentication_details_id = existingAuth?.id ?? null;

      if (!existingAuth) {
        if (Object.keys(authProvided).length > 0) {
          const created = await tx.applicant_authentication_details.create({
            data: { userid, record_created_by, record_status: 'C' },
            select: { id: true }
          });
          authentication_details_id = created.id;
        }
      }

      if (Object.keys(authProvided).length > 0) {
        if (authentication_details_id) {
          await tx.applicant_authentication_details.update({
            where: { id: authentication_details_id },
            data: authProvided,
            select: { id: true }
          });
        } else {
          const created = await tx.applicant_authentication_details.create({
            data: { userid, record_created_by, record_status: 'C', ...authProvided },
            select: { id: true }
          });
          authentication_details_id = created.id;
        }
      }


      const declaration_understanding_documentpath = getFilePath(req, 'declaration_understanding_documentpath');
      let declaration_understandings_id = null;

      if (
        declaration_understanding_documentpath ||
        hasProp(req.body, 'record_updated_on') ||
        hasProp(req.body, 'record_status')
      ) {
        const existingDU = await tx.applicant_declaration_understandings.findFirst({ where: { userid } });

        if (existingDU) {
          const duProvided = {};
          if (declaration_understanding_documentpath) {
            duProvided.declaration_understanding_documentpath = declaration_understanding_documentpath;
          }
          if (hasProp(req.body, 'record_updated_on')) duProvided.record_updated_on = normalize(req.body.record_updated_on);
          if (hasProp(req.body, 'record_updated_by')) duProvided.record_updated_by = normalize(req.body.record_updated_by);
          if (hasProp(req.body, 'record_status')) duProvided.record_status = normalize(req.body.record_status);

          if (Object.keys(duProvided).length > 0) {
            const upd = await tx.applicant_declaration_understandings.update({
              where: { id: existingDU.id },
              data: duProvided,
              select: { id: true }
            });
            declaration_understandings_id = upd.id;
          } else {
            declaration_understandings_id = existingDU.id;
          }
        } else {
          const created = await tx.applicant_declaration_understandings.create({
            data: {
              userid,
              declaration_understanding_documentpath: declaration_understanding_documentpath || null,
              record_updated_on: normalize(req.body.record_updated_on),
              record_created_by,
              record_updated_by: normalize(req.body.record_updated_by),
              record_status: normalize(req.body.record_status) || 'C',
            },
            select: { id: true }
          });
          declaration_understandings_id = created.id;
        }
      } else {
        const duExisting = await tx.applicant_declaration_understandings.findFirst({
          where: { userid },
          select: { id: true }
        });
        declaration_understandings_id = duExisting?.id || null;
      }

      return {
        applicant_details_id,
        contact_details_id,
        asa_name_ids,
        asa_declaration_id,
        authentication_details_id,
        declaration_understandings_id,
      };
    });

    const safe = (v) => (typeof v === 'bigint' ? Number(v) : v);
    return res.status(200).json({
      message: 'Application and related details updated successfully',
      applicant_details_id: safe(result.applicant_details_id),
      contact_details_id: safe(result.contact_details_id),
      asa_name_ids: Array.isArray(result.asa_name_ids) ? result.asa_name_ids.map(safe) : [],
      asa_declaration_id: safe(result.asa_declaration_id),
      authentication_details_id: safe(result.authentication_details_id),
      declaration_understandings_id: safe(result.declaration_understandings_id),
    });

  } catch (err) {
    console.error('Update applicant (multi-table, prisma) error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports.getStatus = async (req, res) => {
  try{
    const userid=req.user?.userid;

    if(!userid){
      return res.status(400).json({error:'User ID is required'});
    }

    const status=await pool.query(`Select status from application_status where userid=$1 order by id desc limit 1`,[userid]);

    if(!status.rows[0]){
      return res.status(404).json({error:'No application status found for this user'}); 
    }
    return res.status(200).json({message:'Application status fetched successfully',status:status.rows[0].status});
  }
  catch(err){
    return res.json({error:'Internal Server Error'})
  }
};