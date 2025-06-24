import { Router } from 'express';
import {
  getAllInController,
  getInByIdController,
  addInController,
  putInController,
  patchInController,
  deleteController,
} from '../controllers/in-controllers.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import {
  incomeAddSchema,
  incomeUpdateSchema,
} from '../validation/water-schema.js';
import authenticate from '../middlewares/authenticate.js';

const inRouter = Router();

inRouter.use(authenticate);
inRouter.get('/', ctrlWrapper(getAllInController));
// waterRouter.get('/chart', ctrlWrapper(getFinByParamController));

inRouter.get('/:id', isValidId, ctrlWrapper(getInByIdController));

inRouter.post(
  '/add',
  validateBody(incomeAddSchema),
  ctrlWrapper(addInController),
);

inRouter.put('/:id', isValidId, ctrlWrapper(putInController));

inRouter.patch(
  '/:id',

  isValidId,
  validateBody(incomeUpdateSchema),
  ctrlWrapper(patchInController),
);

inRouter.delete('/:id', isValidId, ctrlWrapper(deleteController));

export default inRouter;
