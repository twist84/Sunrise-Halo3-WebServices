import { FileShare as FileShareModel } from '../models/FileShareSchema';
import FileShare from '../../../domain/aggregates/FileShare';
import { FileShareSlot as FileModel } from '../models/FileShareSlotSchema';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import FileShareSlot from '../../../domain/entities/FileShareSlot';
import { Inject, Injectable } from '@nestjs/common';
import UserID from 'src/domain/value-objects/UserId';
import UniqueID from 'src/domain/value-objects/UniqueID';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import Uuid from 'src/domain/value-objects/Uuid';

@Injectable()
export default class FileShareDomainMapper {
  constructor(@Inject(ILoggerSymbol) private readonly logger: ILogger) {}

  public mapToDomainModel(
    fileShare: FileShareModel,
    files: FileModel[],
  ): FileShare {
    const mappedFiles: FileShareSlot[] = files.map(
      (file) =>
        new FileShareSlot({
          id: Uuid.create(file.id),
          uniqueId: new UniqueID(file.uniqueId),
          slotNumber: new SlotNumber(file.slotNumber),
          data: file.data,
          header: file.header,
        }),
    );

    const aggregateAlbum = new FileShare({
      id: Uuid.create(fileShare.id),
      ownerId: UserID.create(fileShare.ownerId),
      message: fileShare.message,
      visibleSlots: fileShare.visibleSlots,
      quotaBytes: fileShare.quotaBytes,
      quotaSlots: fileShare.quotaSlots,
      subscriptionHash: fileShare.subscriptionHash,
      slots: mappedFiles,
    });

    return aggregateAlbum;
  }
}