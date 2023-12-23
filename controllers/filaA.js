const handleShowTypes = async (headers, roleTypes) => {
  try {
    const { version_nbr, wm_deploy_cam } = headers;
    let versionNumber = version_nbr || (wm_deploy_cam ? 80010 : 90100);

    const typesByEnv = await getTypesByEnv(versionNumber);
    if (typesByEnv === false) throw new Error('Could not get typesByEnv');

    const exclusiveTypes = await getExclusiveTypes();
    if (exclusiveTypes === false)
      throw new Error('Could not get exclusive types');

    const exclusiveTypesSet = new Set(exclusiveTypes);

    const globalTypes = typesByEnv.filter((type) =>
      exclusiveTypesSet.has(type)
    );

    return [...globalTypes, ...roleTypes];
  } catch (error) {
    console.log(error);
    let handledError =
      error instanceof Error ? new Error(error.message) : new Error(error);
    await handleCustomError(handledError, ERROR_TYPES.SPLUNK_UTIL, {
      action: 'CHECK-DB-TYPES-ENV',
    });
    return false;
  }
};

// Función para validar tipos de show
const validateShowTypes = async (req, res, next) => {
  res.setHeader('Content-Security-Policy', 'script-src self*');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  try {
    const showTypes = await handleShowTypes(req.headers, req.typesByRole);
    if (showTypes === false) {
      return res
        .status(401)
        .json({ status: false, error: 'Could not get types by env.' });
    }

    req.showTypes = showTypes;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Función para manejar token y tipos de rol
const handleTokenAndRoleTypes = async ({ autk }) => {
  try {
    const userInfoData = await getUserInfo({ autk });
    if (!userInfoData) throw new Error('Could not get info user.');

    const jobCode = userInfoData.userInfo?.['wm-JobCode'];
    if (!jobCode) throw new Error('wm-JobCode not present in response.');

    if (jobCode === 'NOT_FOUND') return [];

    const types = await getTypesByJobCode(jobCode);
    if (types === false) throw new Error('Could not get types by jobcode db.');

    return types;
  } catch (error) {
    console.log(error);
    let handledError =
      error instanceof Error ? new Error(error.message) : new Error(error);
    await handleCustomError(handledError, ERROR_TYPES.SPLUNK_UTIL, {
      action: 'CHECK-JOBCODE',
    });
    return false;
  }
};

module.exports = {
  validateShowTypes,
  handleTokenAndRoleTypes,
  handleShowTypes,
};
