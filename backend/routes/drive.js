import express from 'express';
import { validateAcceptedCandidatesIDs, validateArray, validateDriveId, validateID, validateIsUserDetail, validateName, validateRegistrationOpenedTill, validateString } from '../utils/validators.js';
import { adminGetDrive, applyToDrive, createDrive, sendUpdate, updateStage, userGetDrive } from '../controller/drive.js';
import { driveUploads } from '../utils/multer.js';

const router = express();

router.post('/create/:id', [
  validateName(),
  validateString('company', false),
  validateString('position', false),
  validateArray('postJobDescription'),
  validateString('postJobDescription.*'),
  validateArray('eligibityCriteria'),
  validateString('eligibityCriteria.*'),
  validateArray('placementProcedure'),
  validateString('placementProcedure.*'),
  validateArray('requiredUserDetails'),
  validateIsUserDetail,
  validateArray('stages'),
  validateString('stages.*'),
  validateRegistrationOpenedTill,
  validateID
], driveUploads.single('detailedInfo'),createDrive);
router.get('/admin/get/:id',[
  validateID
], adminGetDrive);
router.put('/update-stage/:id',[
  validateID,
  validateArray('acceptedCandidatesIDs'),
  validateAcceptedCandidatesIDs
], updateStage);
router.put('/send-update/:id', [
  validateID,
  validateString('update', false)
], sendUpdate);

router.get('/user/get/:id', [validateID
],userGetDrive);
router.put('/apply/:id',[
  validateID,
  validateDriveId
], applyToDrive);

export default router;