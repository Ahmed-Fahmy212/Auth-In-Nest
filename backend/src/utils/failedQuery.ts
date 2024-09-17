import {
  Catch,
  ExceptionFilter,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DuplicateExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DuplicateExceptionFilter.name);

  catch(exception: QueryFailedError) {
    const message = exception.message;

    if (this.isDuplicateKeyError(message)) {
      const table = (exception as any).table.toUpperCase();
      this.logAndThrowBadRequest(
        `${table} Duplicate`,
        `${table} Duplicate Error`,
        (exception as any).driverError.detail,
      );
    } else if (this.isNullValueError(message)) {
      const column = (exception as any).column.toUpperCase();
      const table = (exception as any).table.toUpperCase();
      this.logAndThrowBadRequest(
        `${column} Is Required`,
        `${column} Is Required In ${table}`,
        `الحقل ${column} مطلوب`,
      );
    } else if (this.isDefaultRecordError(message)) {
      this.logAndThrowBadRequest(
        `Cannot soft delete default record`,
        `لا يمكن حذف السجل الافتراضي`,
        `Cannot soft delete default record`,
      );
    } else if (this.isDeleteDefaultRecordError(message)) {
      this.logAndThrowBadRequest(
        `Cannot delete default record`,
        `لا يمكن حذف السجل الافتراضي`,
        `Cannot delete default record`,
      );
    } else if (this.isManipulateDefaultRecordError(message)) {
      this.logAndThrowBadRequest(
        `Cannot manipulate default records`,
        `لا يمكن التعامل مع السجلات الافتراضية`,
        `Cannot manipulate default records`,
      );
    } else {
      this.logger.error(exception);
      console.error(exception);
      throw new InternalServerErrorException();
    }
  }

  private isDuplicateKeyError(message: string): boolean {
    return message.includes('duplicate key value violates unique constraint');
  }

  private isNullValueError(message: string): boolean {
    return message.includes('null value in column');
  }

  private isDefaultRecordError(message: string): boolean {
    return message.includes('Cannot soft delete default record');
  }

  private isDeleteDefaultRecordError(message: string): boolean {
    return message.includes('Cannot delete default record');
  }

  private isManipulateDefaultRecordError(message: string): boolean {
    return message.includes('Cannot manipulate default records');
  }

  private logAndThrowBadRequest(
    logMessage: string,
    errorMessage: string,
    arabicErrorMessage: string,
  ): void {
    this.logger.error(logMessage);
    throw new BadRequestException({
      message: errorMessage,
      error: arabicErrorMessage,
    });
  }
}
