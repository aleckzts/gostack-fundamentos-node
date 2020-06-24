import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw Error('Invalid type, expected income or outcome');
    }

    if (isNaN(value)) {
      throw Error('Value has to be a number');
    }

    const balance = this.transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total - value < 0) {
      throw Error('Cannot create outcome transaction without a valid balance')
    }

    const transaction = this.transactionsRepository.create({
      title,
      value: Number(value),
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
