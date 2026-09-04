import { Repository, FindOptionsWhere, ObjectLiteral, DataSource, FindOneOptions, DeepPartial, FindManyOptions, FindOptionsOrder, EntityManager, SelectQueryBuilder } from "typeorm";

export class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;
  protected dataSource: DataSource;

  constructor(entity: { new (): T }, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
    this.dataSource = dataSource;
  }

  async create(data: Partial<T>, manager?: EntityManager): Promise<T> {
    if(manager){
      const entity = manager.create(this.repository.target, data as DeepPartial<T>);
      return manager.save(entity);
    }
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async basicFindOneByConditions(
    conditions: FindOptionsWhere<T>,
  ): Promise<T | null> {
    return this.repository.findOne({
      where: conditions,
    } as FindOneOptions<T>);
  }

async basicFindManyByConditions(
  conditions: FindOptionsWhere<T>,
  orderBy: keyof T = 'created_at' as keyof T,
  direction: 'ASC' | 'DESC' = 'DESC',
): Promise<T[]> {
  const order: FindOptionsOrder<T> = {
    [orderBy]: direction,
  } as FindOptionsOrder<T>;

  return this.repository.find({
    where: conditions,
    order,
  });
}

  async findOneByConditions(
    conditions: FindOptionsWhere<T>,
    order: 'DESC' | 'ASC' = 'DESC',
    orderBy: keyof T
  ): Promise<T | null> {
    return this.repository.findOne({
      where: conditions,
      order: { [orderBy as string]: order },
    } as FindOneOptions<T>);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOneByUUID(uuid: string): Promise<T|null> {
    return this.repository.findOne({
      where: { uuid } as unknown as FindOptionsWhere<T>
    });
  }
   async findAndCountAll(): Promise<number> {
    return this.repository.count();
  }

   async findInChunks(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async updateOne(where: Partial<T>, updates: Partial<T>): Promise<void> {
    await this.repository.update(where, updates);
  }

  async deleteByCondition(
    conditions: FindOptionsWhere<T>
  ): Promise<void> {
    await this.repository.delete(conditions);
  }

  async save(data: Partial<T>): Promise<T> {
    return this.repository.save(data as DeepPartial<T>);
  }

  getRepo(): Repository<T> {
    return this.repository;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async findManyAndRelations(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOneAndRelations(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async rawQuery(query: string, params?: any[]): Promise<any> {
        return this.dataSource.query(query, params ?? []);
    }

  async getPagedDataWithQueryBuilder(
    qb: SelectQueryBuilder<T>,
    pageNumber: number,
    recordsPerPage: number,
  ) {
    const page = Math.max(pageNumber, 1);
    const perPage = Math.max(recordsPerPage, 1);
    const offset = (page - 1) * perPage;

    /* ---------- COUNT QUERY ---------- */
    const countQb = qb.clone();

    const total = await countQb
      .skip(undefined)
      .take(undefined)
      .orderBy()
      .getCount();

    /* ---------- DATA QUERY ---------- */
    const { entities, raw } = await qb
      .skip(offset)
      .take(perPage)
      .getRawAndEntities();

    return {
      data: {
        entities, raw
      },
      total,
      page,
      perPage,
      pageCount: Math.ceil(total / perPage),
    };
  }
}
