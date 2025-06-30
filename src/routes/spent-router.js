import { Router } from 'express';
import {
  getAllSpentController,
  getSpentByIdController,
  addSpentController,
  putWaterController,
  patchSpentController,
  deleteController,
} from '../controllers/spent-controllers.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import {
  spentAddSchema,
  spentUpdateSchema,
} from '../validation/spent-schema.js';
import authenticate from '../middlewares/authenticate.js';

const waterRouter = Router();

waterRouter.use(authenticate);
waterRouter.get('/', ctrlWrapper(getAllSpentController));
// waterRouter.get('/chart', ctrlWrapper(getFinByParamController));

waterRouter.get('/:id', isValidId, ctrlWrapper(getSpentByIdController));

waterRouter.post(
  '/add',
  validateBody(spentAddSchema),
  ctrlWrapper(addSpentController),
);

waterRouter.put('/:id', isValidId, ctrlWrapper(putWaterController));

waterRouter.patch(
  '/:id',

  isValidId,
  validateBody(spentUpdateSchema),
  ctrlWrapper(patchSpentController),
);

waterRouter.delete('/:id', isValidId, ctrlWrapper(deleteController));

export default waterRouter;
