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
  const client = await pool.connect();
  try {
    const userid = req.user?.userid;
    const record_created_by = req.user?.userid;
    const name_of_applicant = req.user?.name;

    if (!userid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!name_of_applicant) {
      return res.status(400).json({ error: 'name_of_applicant is required' });
    }
    if (!record_created_by) {
      return res.status(400).json({ error: 'record_created_by is required' });
    }

    await client.query('BEGIN');

    const exist = await client.query('SELECT id FROM applicant_details WHERE userid = $1', [userid]);
    if (exist.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Application already exists for this user' });
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

    const reg_incorporation_documentpath = getFilePath(req, 'reg_incorporation_documentpath');
    const license_no_documentpath = getFilePath(req, 'license_no_documentpath');
    const gstn_reg_no_documentpath = getFilePath(req, 'gstn_reg_no_documentpath');
    const tax_tan_documentpath = getFilePath(req, 'tax_tan_documentpath');
    const board_resolution_documentpath = getFilePath(req, 'board_resolution_documentpath');
    const provision_aadhar_documentpath = getFilePath(req, 'provision_aadhar_documentpath');

    const aadhar_auth_aua_bool = toBool(aadhar_auth_aua);
    const aadhar_auth_aua_kua_bool = toBool(aadhar_auth_aua_kua);

    const insertApplicantDetailsSQL = `
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
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      )
      RETURNING id
    `;

    const applicantValues = [
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

    const applicantInsert = await client.query(insertApplicantDetailsSQL, applicantValues);
    const applicant_details_id = applicantInsert.rows[0].id;


    const cd = req.body; 
    const insertContactSQL = `
      INSERT INTO contact_details (
        userid,
        mpoc_name, mpoc_full_designation, mpoc_email_address, mpoc_mobile_number, mpoc_telephone_number,
        person_authorised_name, person_authorised_full_designation, person_authorised_email_address, person_authorised_mobile_number, person_authorised_telephone_number,
        personnel_name, personnel_full_designation, personnel_email_address, personnel_mobile_number, personnel_telephone_number,
        tpoc_name, tpoc_full_designation, tpoc_email_address, tpoc_mobile_number, tpoc_telephone_number,
        cxo_name, cxo_full_designation, cxo_email_address, cxo_mobile_number, cxo_telephone_number,
        other_personnel_name, other_personnel_full_designation, other_personnel_email_address, other_personnel_mobile_number, other_personnel_telephone_number,
        infrastructure_details_mpoc_tpoc_name, infrastructure_details_email_address, infrastructure_details_mobile_no, infrastructure_details_address, infrastructure_details_district, infrastructure_details_state, infrastructure_details_pin_code,
        data_centre_mpoc_tpoc_name, data_centre_email_address, data_centre_mobile_number, data_centre_address, data_centre_district, data_centre_state, data_centre_pin_code,
        data_recovery_centre_mpoc_tpoc_name, data_recovery_centre_email_address, data_recovery_centre_mobile_number, data_recovery_centre_address, data_recovery_centre_district, data_recovery_centre_state, data_recovery_centre_pin_code,
        grievance_redressal_websiteurl, grievance_redressal_email_address, grievance_redressal_helpdesk_number,
        record_updated_on, record_created_by, record_updated_by, record_status
      ) VALUES (
        $1,
        $2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,
        $12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21,
        $22,$23,$24,$25,$26,
        $27,$28,$29,$30,$31,
        $32,$33,$34,$35,$36,$37,$38,
        $39,$40,$41,$42,$43,$44,$45,
        $46,$47,$48,$49,$50,$51,$52,
        $53,$54,$55,
        $56,$57,$58,$59
      )
      RETURNING id
    `;

    const contactValues = [
      userid,
      cd.mpoc_name || null, cd.mpoc_full_designation || null, cd.mpoc_email_address || null, cd.mpoc_mobile_number || null, cd.mpoc_telephone_number || null,
      cd.person_authorised_name || null, cd.person_authorised_full_designation || null, cd.person_authorised_email_address || null, cd.person_authorised_mobile_number || null, cd.person_authorised_telephone_number || null,
      cd.personnel_name || null, cd.personnel_full_designation || null, cd.personnel_email_address || null, cd.personnel_mobile_number || null, cd.personnel_telephone_number || null,
      cd.tpoc_name || null, cd.tpoc_full_designation || null, cd.tpoc_email_address || null, cd.tpoc_mobile_number || null, cd.tpoc_telephone_number || null,
      cd.cxo_name || null, cd.cxo_full_designation || null, cd.cxo_email_address || null, cd.cxo_mobile_number || null, cd.cxo_telephone_number || null,
      cd.other_personnel_name || null, cd.other_personnel_full_designation || null, cd.other_personnel_email_address || null, cd.other_personnel_mobile_number || null, cd.other_personnel_telephone_number || null,
      cd.infrastructure_details_mpoc_tpoc_name || null, cd.infrastructure_details_email_address || null, cd.infrastructure_details_mobile_no || null, cd.infrastructure_details_address || null, cd.infrastructure_details_district || null, cd.infrastructure_details_state || null, cd.infrastructure_details_pin_code || null,
      cd.data_centre_mpoc_tpoc_name || null, cd.data_centre_email_address || null, cd.data_centre_mobile_number || null, cd.data_centre_address || null, cd.data_centre_district || null, cd.data_centre_state || null, cd.data_centre_pin_code || null,
      cd.data_recovery_centre_mpoc_tpoc_name || null, cd.data_recovery_centre_email_address || null, cd.data_recovery_centre_mobile_number || null, cd.data_recovery_centre_address || null, cd.data_recovery_centre_district || null, cd.data_recovery_centre_state || null, cd.data_recovery_centre_pin_code || null,
      cd.grievance_redressal_websiteurl || null, cd.grievance_redressal_email_address || null, cd.grievance_redressal_helpdesk_number || null,
      cd.record_updated_on || null, record_created_by, cd.record_updated_by || null, cd.record_status || 'C',
    ];

    const contactInsert = await client.query(insertContactSQL, contactValues);
    const contact_details_id = contactInsert.rows[0].id;


    const nameAsaInput = req.body.name_asa;
    let asa_name_ids = [];

    if (Array.isArray(nameAsaInput)) {
      for (const name_asa of nameAsaInput) {
        if (!name_asa) continue;
        const ins = await client.query(
          `INSERT INTO applicant_asa_name (
             userid, name_asa, record_updated_on, record_created_by, record_updated_by, record_status
           ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
          [userid, name_asa, req.body.record_updated_on || null, record_created_by, req.body.record_updated_by || null, req.body.record_status || 'C']
        );
        asa_name_ids.push(ins.rows[0].id);
      }
    } else if (nameAsaInput) {
      const ins = await client.query(
        `INSERT INTO applicant_asa_name (
           userid, name_asa, record_updated_on, record_created_by, record_updated_by, record_status
         ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [userid, nameAsaInput, req.body.record_updated_on || null, record_created_by, req.body.record_updated_by || null, req.body.record_status || 'C']
      );
      asa_name_ids.push(ins.rows[0].id);
    }

    const declaration_asa_documentpath = getFilePath(req, 'declaration_asa_documentpath');
    const declaration_asa = req.body.declaration_asa || null;

    let asa_declaration_id = null;
    if (declaration_asa || declaration_asa_documentpath) {
      const insDec = await client.query(
        `INSERT INTO applicant_asa_declaration (
           userid, declaration_asa, declaration_asa_documentpath, record_updated_on, record_created_by, record_updated_by, record_status
         ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [userid, declaration_asa, declaration_asa_documentpath || null, req.body.record_updated_on || null, record_created_by, req.body.record_updated_by || null, req.body.record_status || 'C']
      );
      asa_declaration_id = insDec.rows[0].id;
    }

    const applicant_conf_uidai_info_policy_documentpath = getFilePath(req, 'applicant_conf_uidai_info_policy_documentpath');
    const applicant_conf_uidai_model_doc_documentpath = getFilePath(req, 'applicant_conf_uidai_model_doc_documentpath');

    const auth_financial_transaction_bool = toBool(req.body.auth_financial_transaction);
    const applicant_conf_uidai_info_policy_bool = toBool(req.body.applicant_conf_uidai_info_policy);
    const applicant_conf_uidai_model_doc_bool = toBool(req.body.applicant_conf_uidai_model_doc);

    const insertAuthSQL = `
      INSERT INTO applicant_authentication_details (
        userid,
        territorial_use_auth_facility,
        territorial_use_auth_facility_value,
        auth_financial_transaction,
        device_form_factor,
        auth_assist_user,
        mode_of_authentication,
        connectivity_support,
        connectivity_support_value,
        applicant_conf_uidai_info_policy,
        applicant_conf_uidai_info_policy_documentpath,
        applicant_conf_uidai_model_doc,
        applicant_conf_uidai_model_doc_documentpath,
        record_updated_on,
        record_created_by,
        record_updated_by,
        record_status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      )
      RETURNING id
    `;

    const authValues = [
      userid,
      req.body.territorial_use_auth_facility || null,
      req.body.territorial_use_auth_facility_value || null,
      auth_financial_transaction_bool,
      req.body.device_form_factor || null,
      req.body.auth_assist_user || null,
      req.body.mode_of_authentication || null,
      req.body.connectivity_support || null,
      req.body.connectivity_support_value || null,
      applicant_conf_uidai_info_policy_bool,
      applicant_conf_uidai_info_policy_documentpath || null,
      applicant_conf_uidai_model_doc_bool,
      applicant_conf_uidai_model_doc_documentpath || null,
      req.body.record_updated_on || null,
      record_created_by,
      req.body.record_updated_by || null,
      req.body.record_status || 'C',
    ];

    const authInsert = await client.query(insertAuthSQL, authValues);
    const authentication_details_id = authInsert.rows[0].id;

    const declaration_understanding_documentpath = getFilePath(req, 'declaration_understanding_documentpath');

    let declaration_understandings_id = null;
    if (declaration_understanding_documentpath) {
      const insertDecUnderstandSQL = `
        INSERT INTO applicant_declaration_understandings (
          userid,
          declaration_understanding_documentpath,
          record_updated_on,
          record_created_by,
          record_updated_by,
          record_status
        ) VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id
      `;
      const insDU = await client.query(insertDecUnderstandSQL, [
        userid,
        declaration_understanding_documentpath,
        req.body.record_updated_on || null,
        record_created_by,
        req.body.record_updated_by || null,
        req.body.record_status || 'C',
      ]);
      declaration_understandings_id = insDU.rows[0].id;
    }

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Application and related details created successfully',
      applicant_details_id,
      contact_details_id,
      asa_name_ids,
      asa_declaration_id,
      authentication_details_id,
      declaration_understandings_id,
    });
  } catch (err) {
    console.error('Create applicant (multi-table) error:', err);
    try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};




const rowOrNull = (res) => (res?.rows?.[0] ? res.rows[0] : null);

async function fetchApplicationBundle(userid) {
  const [applicantRes,contactRes,asaNamesRes,asaDeclRes,authRes,understandRes,]=await Promise.all([
    pool.query(
      `SELECT *
       FROM applicant_details
       WHERE userid = $1
       ORDER BY id DESC        -- TODO: change 'id' to your real PK or updated column
       LIMIT 1`,
      [userid]
    ),
    pool.query(
      `SELECT *
       FROM contact_details
       WHERE userid = $1
       ORDER BY id DESC        -- TODO: change 'id' to your real PK or updated column
       LIMIT 1`,
      [userid]
    ),
    pool.query(
      `SELECT *
       FROM applicant_asa_name
       WHERE userid = $1
       ORDER BY id ASC`,
      [userid]
    ),

    pool.query(
      `SELECT *
       FROM applicant_asa_declaration
       WHERE userid = $1
       ORDER BY id DESC
       LIMIT 1`,
      [userid]
    ),

    pool.query(
      `SELECT *
       FROM applicant_authentication_details
       WHERE userid = $1
       ORDER BY id DESC        -- TODO: change 'id' to your real PK or updated column
       LIMIT 1`,
      [userid]
    ),
    pool.query(
      `SELECT *
       FROM applicant_declaration_understandings
       WHERE userid = $1
       ORDER BY id DESC
       LIMIT 1`,
      [userid]
    ),
  ]);

  return {
    applicant_details: rowOrNull(applicantRes),
    contact_details: rowOrNull(contactRes),
    applicant_asa_name: asaNamesRes.rows || [],
    applicant_asa_declaration: rowOrNull(asaDeclRes),
    applicant_authentication_details: rowOrNull(authRes),
    applicant_declaration_understandings: rowOrNull(understandRes),
  };
}

module.exports.getApplication = async (req, res) => {
  try {
    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ error: 'Unauthorized' });

    const data = await fetchApplicationBundle(userid);

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

    return res.status(200).json({
      message: 'Application fetched successfully',
      userid,
      ...data,
    });
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



const hasProp = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const normalize = (v) => (v === '' || typeof v === 'undefined' ? null : v);

function buildUpdateQuery(table, allowedFields, provided, whereObj) {
  const set = [];
  const values = [];

  for (const col of allowedFields) {
    if (hasProp(provided, col)) {
      set.push(`${col} = $${values.length + 1}`);
      values.push(provided[col]);
    }
  }
  if (set.length === 0) return null;

  const whereKeys = Object.keys(whereObj);
  const whereClause = whereKeys
    .map((k, i) => `${k} = $${values.length + i + 1}`)
    .join(' AND ');
  const whereValues = whereKeys.map((k) => whereObj[k]);

  return {
    sql: `UPDATE ${table} SET ${set.join(', ')} WHERE ${whereClause} RETURNING id`,
    values: [...values, ...whereValues],
  };
}

module.exports.updateApplication = async (req, res) => {
  const client = await pool.connect();
  try {
    const userid = req.user?.userid;
    const record_created_by = req.user?.userid;
    const name_of_applicant = req.user?.name; 

    if (!userid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await client.query('BEGIN');

    const check = await client.query(
      'SELECT id FROM applicant_details WHERE userid = $1',
      [userid]
    );
    if (check.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'No application found for this user' });
    }

    const reg_incorporation_documentpath = getFilePath(req, 'reg_incorporation_documentpath');
    const license_no_documentpath = getFilePath(req, 'license_no_documentpath');
    const gstn_reg_no_documentpath = getFilePath(req, 'gstn_reg_no_documentpath');
    const tax_tan_documentpath = getFilePath(req, 'tax_tan_documentpath');
    const board_resolution_documentpath = getFilePath(req, 'board_resolution_documentpath');
    const provision_aadhar_documentpath = getFilePath(req, 'provision_aadhar_documentpath');

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

    let applicant_details_id = check.rows[0].id;
    const updApplicant = buildUpdateQuery(
      'applicant_details',
      applicantDetailsAllowed,
      applicantProvided,
      { userid }
    );
    if (updApplicant) {
      const r = await client.query(updApplicant.sql, updApplicant.values);
      applicant_details_id = r.rows[0].id;
    }

    const cd = req.body;
    const contactAllowed = [
      'mpoc_name', 'mpoc_full_designation', 'mpoc_email_address', 'mpoc_mobile_number', 'mpoc_telephone_number',
      'person_authorised_name', 'person_authorised_full_designation', 'person_authorised_email_address', 'person_authorised_mobile_number', 'person_authorised_telephone_number',
      'personnel_name', 'personnel_full_designation', 'personnel_email_address', 'personnel_mobile_number', 'personnel_telephone_number',
      'tpoc_name', 'tpoc_full_designation', 'tpoc_email_address', 'tpoc_mobile_number', 'tpoc_telephone_number',
      'cxo_name', 'cxo_full_designation', 'cxo_email_address', 'cxo_mobile_number', 'cxo_telephone_number',
      'other_personnel_name', 'other_personnel_full_designation', 'other_personnel_email_address', 'other_personnel_mobile_number', 'other_personnel_telephone_number',
      'infrastructure_details_mpoc_tpoc_name', 'infrastructure_details_email_address', 'infrastructure_details_mobile_no', 'infrastructure_details_address', 'infrastructure_details_district', 'infrastructure_details_state', 'infrastructure_details_pin_code',
      'data_centre_mpoc_tpoc_name', 'data_centre_email_address', 'data_centre_mobile_number', 'data_centre_address', 'data_centre_district', 'data_centre_state', 'data_centre_pin_code',
      'data_recovery_centre_mpoc_tpoc_name', 'data_recovery_centre_email_address', 'data_recovery_centre_mobile_number', 'data_recovery_centre_address', 'data_recovery_centre_district', 'data_recovery_centre_state', 'data_recovery_centre_pin_code',
      'grievance_redressal_websiteurl', 'grievance_redressal_email_address', 'grievance_redressal_helpdesk_number',
      'record_updated_on', 'record_updated_by', 'record_status',
    ];
    const contactProvided = {};
    for (const k of contactAllowed) {
      if (hasProp(cd, k)) contactProvided[k] = normalize(cd[k]);
    }


    const contactCheck = await client.query(
      'SELECT id FROM contact_details WHERE userid = $1',
      [userid]
    );
    let contact_details_id = null;
    if (contactCheck.rows.length === 0) {
      if (Object.keys(contactProvided).length > 0) {
        const insertContactSQL = `
          INSERT INTO contact_details (userid, record_created_by, record_status)
          VALUES ($1, $2, $3) RETURNING id
        `;
        const ins = await client.query(insertContactSQL, [userid, record_created_by, 'C']);
        contact_details_id = ins.rows[0].id;
      }
    } else {
      contact_details_id = contactCheck.rows[0].id;
    }

    const updContact = buildUpdateQuery(
      'contact_details',
      contactAllowed,
      contactProvided,
      { userid }
    );
    if (updContact) {
      const r = await client.query(updContact.sql, updContact.values);
      contact_details_id = r.rows[0].id;
    }

    let asa_name_ids = [];
    const nameAsaInput = req.body.name_asa;
    if (typeof nameAsaInput !== 'undefined') {
      await client.query('DELETE FROM applicant_asa_name WHERE userid = $1', [userid]);

      const names = Array.isArray(nameAsaInput) ? nameAsaInput : [nameAsaInput];
      for (const name_asa of names) {
        const value = normalize(name_asa);
        if (!value) continue;
        const ins = await client.query(
          `INSERT INTO applicant_asa_name (userid, name_asa, record_updated_on, record_created_by, record_updated_by, record_status)
           VALUES ($1,$2,$3,$4,$5,$6)
           RETURNING id`,
          [
            userid,
            value,
            normalize(req.body.record_updated_on),
            record_created_by,
            normalize(req.body.record_updated_by),
            normalize(req.body.record_status) || 'C',
          ]
        );
        asa_name_ids.push(ins.rows[0].id);
      }
    } else {
      const existing = await client.query(
        'SELECT id FROM applicant_asa_name WHERE userid = $1',
        [userid]
      );
      asa_name_ids = existing.rows.map((r) => r.id);
    }

    const declaration_asa_documentpath = getFilePath(req, 'declaration_asa_documentpath');
    const declaration_asa_provided = hasProp(req.body, 'declaration_asa') || !!declaration_asa_documentpath;

    let asa_declaration_id = null;
    if (declaration_asa_provided) {
      const decCheck = await client.query(
        'SELECT id FROM applicant_asa_declaration WHERE userid = $1',
        [userid]
      );
      const decProvided = {};
      if (hasProp(req.body, 'declaration_asa')) decProvided.declaration_asa = normalize(req.body.declaration_asa);
      if (declaration_asa_documentpath) decProvided.declaration_asa_documentpath = declaration_asa_documentpath;
      if (hasProp(req.body, 'record_updated_on')) decProvided.record_updated_on = normalize(req.body.record_updated_on);
      if (hasProp(req.body, 'record_updated_by')) decProvided.record_updated_by = normalize(req.body.record_updated_by);
      if (hasProp(req.body, 'record_status')) decProvided.record_status = normalize(req.body.record_status);

      if (decCheck.rows.length > 0) {
        // Update
        const updDec = buildUpdateQuery(
          'applicant_asa_declaration',
          ['declaration_asa', 'declaration_asa_documentpath', 'record_updated_on', 'record_updated_by', 'record_status'],
          decProvided,
          { userid }
        );
        if (updDec) {
          const r = await client.query(updDec.sql, updDec.values);
          asa_declaration_id = r.rows[0].id;
        } else {
          asa_declaration_id = decCheck.rows[0].id;
        }
      } else {
        // Insert
        const insDec = await client.query(
          `INSERT INTO applicant_asa_declaration (
            userid, declaration_asa, declaration_asa_documentpath, record_updated_on, record_created_by, record_updated_by, record_status
          ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [
            userid,
            normalize(req.body.declaration_asa),
            declaration_asa_documentpath || null,
            normalize(req.body.record_updated_on),
            record_created_by,
            normalize(req.body.record_updated_by),
            normalize(req.body.record_status) || 'C',
          ]
        );
        asa_declaration_id = insDec.rows[0].id;
      }
    } else {
      // unchanged
      const decExisting = await client.query(
        'SELECT id FROM applicant_asa_declaration WHERE userid = $1',
        [userid]
      );
      asa_declaration_id = decExisting.rows[0]?.id || null;
    }

    const applicant_conf_uidai_info_policy_documentpath = getFilePath(req, 'applicant_conf_uidai_info_policy_documentpath');
    const applicant_conf_uidai_model_doc_documentpath = getFilePath(req, 'applicant_conf_uidai_model_doc_documentpath');

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

    const authCheck = await client.query(
      'SELECT id FROM applicant_authentication_details WHERE userid = $1',
      [userid]
    );
    let authentication_details_id = null;
    if (authCheck.rows.length === 0) {
      if (Object.keys(authProvided).length > 0) {
        const insertAuthSQL = `
          INSERT INTO applicant_authentication_details (userid, record_created_by, record_status)
          VALUES ($1, $2, $3) RETURNING id
        `;
        const ins = await client.query(insertAuthSQL, [userid, record_created_by, 'C']);
        authentication_details_id = ins.rows[0].id;
      }
    } else {
      authentication_details_id = authCheck.rows[0].id;
    }

    const updAuth = buildUpdateQuery(
      'applicant_authentication_details',
      authAllowed,
      authProvided,
      { userid }
    );
    if (updAuth) {
      const r = await client.query(updAuth.sql, updAuth.values);
      authentication_details_id = r.rows[0].id;
    }


    const declaration_understanding_documentpath = getFilePath(req, 'declaration_understanding_documentpath');
    let declaration_understandings_id = null;

    if (declaration_understanding_documentpath || hasProp(req.body, 'record_updated_on') || hasProp(req.body, 'record_status')) {
      const duCheck = await client.query(
        'SELECT id FROM applicant_declaration_understandings WHERE userid = $1',
        [userid]
      );

      if (duCheck.rows.length > 0) {
        const duProvided = {};
        if (declaration_understanding_documentpath) {
          duProvided.declaration_understanding_documentpath = declaration_understanding_documentpath;
        }
        if (hasProp(req.body, 'record_updated_on')) duProvided.record_updated_on = normalize(req.body.record_updated_on);
        if (hasProp(req.body, 'record_updated_by')) duProvided.record_updated_by = normalize(req.body.record_updated_by);
        if (hasProp(req.body, 'record_status')) duProvided.record_status = normalize(req.body.record_status);

        const updDU = buildUpdateQuery(
          'applicant_declaration_understandings',
          ['declaration_understanding_documentpath', 'record_updated_on', 'record_updated_by', 'record_status'],
          duProvided,
          { userid }
        );
        if (updDU) {
          const r = await client.query(updDU.sql, updDU.values);
          declaration_understandings_id = r.rows[0].id;
        } else {
          declaration_understandings_id = duCheck.rows[0].id;
        }
      } else {
        const insDU = await client.query(
          `INSERT INTO applicant_declaration_understandings (
            userid, declaration_understanding_documentpath, record_updated_on, record_created_by, record_updated_by, record_status
          ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
          [
            userid,
            declaration_understanding_documentpath || null,
            normalize(req.body.record_updated_on),
            record_created_by,
            normalize(req.body.record_updated_by),
            normalize(req.body.record_status) || 'C',
          ]
        );
        declaration_understandings_id = insDU.rows[0].id;
      }
    } else {
      const duExisting = await client.query(
        'SELECT id FROM applicant_declaration_understandings WHERE userid = $1',
        [userid]
      );
      declaration_understandings_id = duExisting.rows[0]?.id || null;
    }

    await client.query('COMMIT');

    return res.status(200).json({
      message: 'Application and related details updated successfully',
      applicant_details_id,
      contact_details_id,
      asa_name_ids,
      asa_declaration_id,
      authentication_details_id,
      declaration_understandings_id,
    });
  } catch (err) {
    console.error('Update applicant (multi-table) error:', err);
    try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};