import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import crypto from 'crypto';

export type AssetDocument = HydratedDocument<Asset>;

@Schema({
  timestamps: true,
  collectionOptions: {
    /* para habilitar ter uma verssão do documento anterior (fullDocumentBeforeChange) */
    changeStreamPreAndPostImages: {
      enabled: true,
    },
  },
})
export class Asset {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string;

  @Prop({ unique: true, index: true })
  name: string;

  @Prop({ unique: true, index: true })
  symbol: string;

  @Prop()
  image: string;

  @Prop({ type: mongoose.Types.Decimal128 })
  price: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
