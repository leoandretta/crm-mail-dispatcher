import { Attributes, CountOptions, FindAndCountOptions, FindOptions, Model, OrderItem } from "sequelize";
import { GroupDescriptor } from "devextreme/data";

export type TypeDXFormat = 'default' | 'main' | 'data' | 'filters' | 'grouping'

export interface DXFormatParams<
    M extends Model<any, any>,
    A extends Attributes<M>
> {
    find: (options?: FindOptions<A>) => Promise<M[]>;
    count: (options?: CountOptions<A>) => Promise<number>;
    findAndCountAll: (options: FindAndCountOptions<A>) => Promise<{rows: M[], count: number}>;
}

export type ComparisonOperator = '=' | 'contains' | '>' | '>=' | '<' | '<=' | '!=' | '<>' | 'between' | 'notcontains' | 'startswith' | 'endswith';

export type LogicalOperator = 'and' | 'or';

export type DxCondition<T> = [keyof T, ComparisonOperator, string | number | Date | boolean];

export type DxNotCondition<T> = ['!', DxCondition<T>];

export type DxConditionGroup<T> =  DxCondition<T> | DxNotCondition<T> | (DxCondition<T> | DxNotCondition<T> | LogicalOperator | DxConditionGroup<T>)[];

export type DxGroup = {
  selector: string,
  desc: boolean,
  isExpanded: boolean
}

export type DxSort = {
  selector: string,
  desc: boolean
}

export type AttributeInclude<T> = {
  association: string;
  attributes: (keyof T)[];
  required?: boolean | null;
  include?: AttributeInclude<T>[];
  group?: string[];
  order?: FindOptions['order'];
  separate?: boolean | null;
  subQuery?: boolean | null;
  where?: any; // Where conditions
};

export interface ResultDefault<A> 
{
  type: 'default';
  distinct?: boolean;
}

export interface ResultMain<A> 
{
  type: 'main';
  order?: FindOptions['order'];
  separate?: boolean;
  subQuery?: boolean;
  raw?: boolean;
  distinct?: boolean;
}

export interface ResultData<A> 
{
  type: 'data';
  attributes: FindOptions['attributes'];
  order?: FindOptions['order'];
  subQuery?: boolean | null;
}

export interface ResultFilters<A> 
{
  type: 'filters';
  attributes: FindOptions['attributes'];
  order?: FindOptions['order'];
  subQuery?: false;
  raw: true
}

export interface ResultGrouping<A> 
{
  type: 'grouping';
  attributes: FindOptions['attributes'];
  order?: OrderItem[];
  distinct: true;
  raw: true;
  subQuery: false
}

export type Result<T> = (ResultDefault<T> | ResultMain<T> | ResultData<T> | ResultFilters<T> | ResultGrouping<T> ) & {
  attributes: FindOptions['attributes'];
  include: AttributeInclude<T>[];
  group?: string[],
  where?: any; // Root where condition
}


// export interface Result<T> {
//   attributes: FindOptions['attributes'];
//   include: AttributeInclude<T>[];
//   order?: FindOptions['order'];
//   group?: string[],
//   separate?: boolean | null;
//   subQuery?: boolean | null;
//   where?: any; // Root where condition
// }

export type AttributesCondition = {
  field: string;
  association: boolean;
  separate?: boolean | null;
  required?: boolean | null;
}

export interface FormatOptions<T> {
  entidade: string;
  attributes?: AttributesCondition[] ;
  field?: string;
  filters?: DxConditionGroup<T>;
  group?: DxGroup | DxGroup[];
  // group?: GroupDescriptor<T> | GroupDescriptor<T>[] ;
  sorts?: DxSort | DxSort[];
}

