import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  putContactController,
  patchContactController,
  deleteController,
} from '../controllers/contacts-controllers.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contact-schema.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);
contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(addContactController),
);
contactsRouter.put(
  '/:id',
  upload.single('photo'),
  isValidId,
  ctrlWrapper(putContactController),
);

contactsRouter.patch(
  '/:id',
  upload.single('photo'),
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);
contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteController));

export default contactsRouter;
