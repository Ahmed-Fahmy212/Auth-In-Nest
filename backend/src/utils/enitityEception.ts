/* eslint-disable prettier/prettier */
import { ExceptionFilter, Catch, NotFoundException } from '@nestjs/common';
import { EntityMetadataNotFoundError } from 'typeorm';
import { Logger } from '@nestjs/common';

@Catch(EntityMetadataNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  private logger = new Logger('EntityNotFoundException');
  
  catch(exception: EntityMetadataNotFoundError) {
    const entityName = (exception && (exception as any).entityClass && (exception as any).entityClass.name) || 'Entity';
    
    this.logger.error(`${entityName} Not Found`);
    throw new NotFoundException(`${entityName} Not Found`);
  }
}
