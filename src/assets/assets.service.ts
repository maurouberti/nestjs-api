import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { Observable } from 'rxjs';

@Injectable()
export class AssetsService {
  constructor(@InjectModel(Asset.name) private assetSchema: Model<Asset>) {}

  create(createAssetDto: CreateAssetDto) {
    return this.assetSchema.create(createAssetDto);
  }

  findAll() {
    return this.assetSchema.find();
  }

  findOne(symbol: string) {
    return this.assetSchema.findOne({ symbol });
  }

  update(symbol: string, updateAssetDto: UpdateAssetDto) {
    return this.assetSchema.findOneAndUpdate({ symbol }, updateAssetDto, {
      new: true,
    });
  }

  remove(symbol: string) {
    return `This action removes a #${symbol} asset`;
  }

  subscribeNewPriceChangedEvents(): Observable<Asset> {
    return new Observable((observer) => {
      this.assetSchema
        .watch(
          [
            {
              $match: {
                $or: [
                  { operationType: 'update' },
                  { operationType: 'replace' },
                ],
              },
            },
          ],
          {
            fullDocument: 'updateLookup',
            fullDocumentBeforeChange: 'whenAvailable',
          },
        )
        .on('change', async (data) => {
          if (
            data.fullDocumentBeforeChange &&
            data.fullDocument.price === data.fullDocumentBeforeChange.price
          ) {
            return;
          }

          const asset = await this.assetSchema.findOne({
            _id: data.fullDocument._id,
          });

          observer.next(asset!);
        });
    });
  }
}
