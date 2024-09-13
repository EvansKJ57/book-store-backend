import { SetMetadata } from '@nestjs/common';

export const TRANSACTION_KEY = 'isTransaction';

export const Transactional = () => SetMetadata(TRANSACTION_KEY, true);
