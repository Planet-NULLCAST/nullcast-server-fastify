import mongoose from 'mongoose';

const Subscriber = mongoose.model(
  'Subscriber',
  new mongoose.Schema<any>({
    email: String
  })
);

export default Subscriber;
