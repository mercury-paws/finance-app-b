import { Router } from 'express';
import {
  getAllWaterController,
  getWaterByIdController,
  addWaterController,
  putWaterController,
  patchWaterController,
  deleteController,
  getWaterByDayController,
} from '../controllers/contacts-controllers.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import {
  waterAddSchema,
  waterUpdateSchema,
} from '../validation/water-schema.js';
import authenticate from '../middlewares/authenticate.js';
// import upload from '../middlewares/upload.js';

const waterRouter = Router();

waterRouter.use(authenticate);
waterRouter.get('/', ctrlWrapper(getAllWaterController));

waterRouter.get('/day', ctrlWrapper(getWaterByDayController));

waterRouter.get('/:id', isValidId, ctrlWrapper(getWaterByIdController));

waterRouter.post(
  '/add',
  validateBody(waterAddSchema),
  ctrlWrapper(addWaterController),
);

waterRouter.put('/:id', isValidId, ctrlWrapper(putWaterController));

waterRouter.patch(
  '/:id',
  // upload.single('photo'),
  isValidId,
  validateBody(waterUpdateSchema),
  ctrlWrapper(patchWaterController),
);

waterRouter.delete('/:id', isValidId, ctrlWrapper(deleteController));

export default waterRouter;
