import { Model, Attributes, FindOptions, CountOptions, FindAndCountOptions, Sequelize, Op } from "sequelize";
import { DxConditionGroup, DxGroup, DxSort, FormatOptions, DXFormatParams } from "./interfaces";
import { DXFormat } from "./format";
import { LoadOptions } from "devextreme/data";
import { GroupItem, LoadResultObject } from "devextreme/common/data/custom-store";
import { formatColumns, formatText, formatValue, groupDataBySelectors } from "./utils";

export class Devextreme<
  M extends Model<any, any>,
  A extends Attributes<M>
>
{
    private _find: (options?: FindOptions<A>) => Promise<M[]>;
    private _count: (options?: CountOptions<A>) => Promise<number>;
    private _findAndCountAll: (options: FindAndCountOptions<A>) => Promise<{rows: any[], count: number}>;
    private _db: Sequelize;

    constructor(database: Sequelize, options: DXFormatParams<M, A>)
    {
        this._db = database;
        this._find = options.find 
        this._count = options.count 
        this._findAndCountAll = options.findAndCountAll
    }
    
    async find(params: LoadOptions<A>): Promise<LoadResultObject<M>>
    {
        let result: LoadResultObject<M> = {
            data: []
        };
        
        if(params.customQueryParams) params.customQueryParams = JSON.parse(params.customQueryParams);
        if(params.requireTotalCount) params.requireTotalCount = (params.requireTotalCount as unknown as string) == 'true';
        if(params.requireGroupCount) params.requireGroupCount = (params.requireGroupCount as unknown as string) == 'true' ; 

        if (params.filter) params.filter = JSON.parse(params.filter);
        if (params.group) params.group = JSON.parse(params.group as string);
        if (params.sort) params.sort = JSON.parse(params.sort as string);
        
        const { attributes, entidade } = params.customQueryParams;

        if('dataField' in params) {
            const format_params: FormatOptions<A> = {
                entidade,
                attributes: formatColumns(attributes),
                field: params.dataField as string,
                filters: params.filter as DxConditionGroup<A> | undefined,
                group: params.group as DxGroup | DxGroup[] | undefined,
                sorts: params.sort as DxSort | DxSort[] | undefined
            }
            const _filters = new DXFormat<M,A>(this._db, format_params, 'filters');
            const filters_options = _filters.formatted;
            
            filters_options.limit = params.take ? parseInt(params.take.toString()) : undefined;
            filters_options.offset = params.skip ? parseInt(params.skip.toString()) : undefined;

            const { rows: data, count } = await this._findAndCountAll(filters_options);
            const totalCount = (count as any).reduce((acc: number, curr: any) => {
                acc += curr.count
                return acc;
            }, 0)

            const values = data.reduce((acc: GroupItem<M>[], curr: any) => {
                const text = formatText(params.dataField as string, curr[params.dataField as string])
                const value = formatValue(params.dataField as string, curr[params.dataField as string])
                acc.push({ 
                    key: text, 
                    items: [value]
                })

                return acc;
            }, [])

            result.data = values;
            result.totalCount = totalCount;
        }
        else if(params.group)
        {
            const group = JSON.parse(JSON.stringify(params.group)) as DxGroup | DxGroup[] | undefined;
            const sorts = JSON.parse(JSON.stringify(params.sort)) as DxSort | DxSort[] | undefined;
            
            const format_params = {
                entidade,
                attributes: formatColumns(attributes),
                filters: params.filter,
                group,
                sorts
            }
            const _group = new DXFormat<M,A>(this._db, format_params, 'grouping');
            const group_options = _group.formatted;
            
            if(params.take) group_options.limit = parseInt(params.take.toString());
            if(params.skip) group_options.offset = parseInt(params.skip.toString());
            
            const data = await this._count(group_options)

            result.totalCount = (data as any).reduce((acc: number, curr: any) => {
                acc += curr.count
                return acc;
            }, 0)
            result.groupCount = (data as any).length

            const grouped_data = groupDataBySelectors<A>(data as any, params.group as any)
            if(grouped_data) result.data = grouped_data
        }
        else {
            const format_params = {
                entidade,
                attributes: formatColumns(attributes),
                filters: params.filter,
                group: params.group as DxGroup | DxGroup[] | undefined,
                sorts: params.sort as DxSort | DxSort[] | undefined
            }
            const _default = new DXFormat<M,A>(this._db, format_params, 'default');
            
            const totalCount = await this._count(_default.formatted);
    
            
            const _main = new DXFormat<M,A>(this._db,format_params, 'main');
            
            const main_options = _main.formatted
    
            if(params.take) main_options.limit = parseInt(params.take.toString());
            if(params.skip) main_options.offset = parseInt(params.skip.toString());
            
            let { rows: fatherEntities, count } = await this._findAndCountAll(main_options)
            const ids = fatherEntities.map(el => el.id);

            if(Array.isArray(count)) {
                count = (count as any).reduce((acc: number, curr: any) => {
                    acc += curr.count
                    return acc;
                }, 0)
            }
    
            result.totalCount = count || totalCount
    
            const _data = new DXFormat<M,A>(this._db,format_params, 'data');
            const data_options = _data.formatted
    
            //@ts-ignore
            data_options.where = {
                id: {
                    [Op.in]: ids
                }
            }
    
            result.data = await this._find(data_options)
        }      

        return result;
    }
}