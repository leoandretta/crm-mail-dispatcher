import { Attributes, cast, col, FindOptions,  fn,  Model, Op, OrderItem, Sequelize, where} from "sequelize";
import { AttributeInclude, AttributesCondition, DxCondition, DxConditionGroup, DxGroup, DxNotCondition, DxSort, FormatOptions, LogicalOperator, Result, ResultData, ResultDefault, ResultMain } from "./interfaces";
import { normalizeString } from "../../utils/format";
import { TypeDXFormat } from "./interfaces";

export class DXFormat<
  M extends Model<any, any>,
  A extends Attributes<M>
> 
{
    private _db: Sequelize;
    private _type: TypeDXFormat;
    private _entidade: string;
    private _attributes?: AttributesCondition[];
    private _field?: string;
    private _filters?: DxConditionGroup<A>;
    private _group?: DxGroup | DxGroup[];
    private _sorts?:  DxSort | DxSort[];
    private _groupArray: string[];

    private _result: Result<A>;

    constructor(database: Sequelize, params: FormatOptions<A>, type: TypeDXFormat = "default")
    {
        this._db = database;
        this._type = type;
        
        this._entidade = params.entidade;
        this._attributes = params.attributes;
        this._field = params.field;
        this._filters = params.filters;
        this._group = params.group;
        this._sorts = params.sorts;

        this._groupArray = [];
        
        this._result = this.setResultByType(this._type, this._entidade);
    }

    private setResultByType(type: TypeDXFormat, entidade: string): Result<A>
    {
      switch (type) {
        case "default":
          return {
            type,
            attributes: [
              [this._db.fn("COUNT", this._db.fn("DISTINCT", this._db.col(`${entidade}.id`))), "count"]
            ],
            distinct: true,
            include: []
          } 
        case "main":
          return {
            type: "main",
            attributes: [
              [this._db.fn("DISTINCT", this._db.col(`${entidade}.id`)), "id"]
            ],
            include: [],
            raw: true,
            subQuery: false,
            distinct: true
          } 
        case "data":
          return {
            type: "data",
            attributes: [],
            include: [],
            subQuery: false,
          }
        case "filters":
          return {
            type: "filters",
            attributes: [],
            include: [],
            subQuery: false,
            raw: true,
          }
        case "grouping":
          return {
            type: "grouping",
            attributes: [],
            include: [],
            distinct: true,
            raw: true,
            subQuery: false
          }
        default:
          throw new Error(`Tipo não identificado`);
      }
    }

    private formatCondition(params: DxCondition<A>, model_name: string, negacao: boolean = false): Result<A>["where"]
    {
      let [key, condition, content] = params
      const field = key as unknown as string;
      
      let whereCondition: Result<A>["where"] = {}
      if(typeof content == "undefined" || content == null) return whereCondition;

      if (isNaN(Number(content.toString())) == false && condition == "contains") {
        whereCondition = {
          [Op.and]: [
            this._db.where(
              this._db.cast(this._db.col(`${(field as string).includes('.') ? '' : `${model_name}.`}${field.replace(/\$/g, '')}`), "VARCHAR"),
              {
                [negacao == false ? Op.iLike : Op.notILike]: `%${normalizeString(content.toString())}%`
              }
            )
          ]
        }
      } else {

        const conditionMap: Record<string, any> = {
          '=': { [Op.eq]: content },
          '>': { [Op.gt]: content },
          '<': { [Op.lt]: content },
          '!=': { [Op.ne]: content },
          '<=': { [Op.lte]: content },
          '>=': { [Op.gte]: content },
          '<>': { [Op.ne]: content },
          "between": { [Op.between]: content },
          "contains": { [Op.iLike]: `%${normalizeString(content.toString())}%` },
          "notcontains": { [Op.notILike]: `%${normalizeString(content.toString())}%` },
          "endswith": { [Op.iLike]: `%${normalizeString(content.toString())}` },
          "startswith": { [Op.iLike]: `${normalizeString(content.toString())}%` },
        };
    
        const notConditionMap: Record<string, any> = {
          '=': { [Op.ne]: content },
          '>': { [Op.lte]: content },
          '<': { [Op.gte]: content },
          '!=': { [Op.eq]: content },
          '<=': { [Op.gt]: content },
          '>=': { [Op.lt]: content },
          '<>': { [Op.eq]: content },
          "between": { [Op.notBetween]: content },
          "contains": { [Op.notILike]: `%${normalizeString(content.toString())}%` },
          "notcontains": { [Op.iLike]: `%${normalizeString(content.toString())}%` },
          "endswith": { [Op.notILike]: `%${normalizeString(content.toString())}` },
          "startswith": { [Op.notILike]: `${normalizeString(content.toString())}%` },
        };
    
        if (typeof content == "string" && ['=', '>', '<', '!=', '<=', '>=', '<>'].includes(condition) == false) {
          whereCondition = this._db.where(
            this._db.fn("UNACCENT", this._db.fn("LOWER", this._db.col(`${field.includes('.') ? '' : `${model_name}.`}${field.replace(/\$/g, '')}`))), 
            negacao == false ? conditionMap[condition] : notConditionMap[condition]
          )
        }
        else {
          whereCondition[field] = negacao == false ? conditionMap[condition] : notConditionMap[condition]
        }
      }
      return whereCondition;
    }

    private findOrCreateAssociation(includeArray: AttributeInclude<A>[], associationName: string): AttributeInclude<A>
    {
        let association = includeArray.find((include) => include.association === associationName);
        if (!association) {
          association = {
            association: associationName,
            attributes: [],
            include: [],
          };
      
          includeArray.push(association);
        }
        
        return association;
    }

    private addToAttributes (parts: string[], required: boolean = false)
    {
      if(parts.length == 1) {
        if((this._result.attributes as string[]).includes(parts[0]) == false)  {
          (this._result.attributes as string[]).push(parts[0]);
        }
        return;
      }
      
      let currentInclude = this._result.include;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const associationName = parts[i];
        const association = this.findOrCreateAssociation(currentInclude, associationName);
        if(required == true) {
          association.required = true
        }
        if(association.separate) {
          association.separate = false;
        }
        if (!association.include) {
          association.include = [];
        }
        if (i < parts.length - 2) {
          currentInclude = association.include;
        }
      }
  
      const lastAssociation = this.findOrCreateAssociation(currentInclude, parts[parts.length - 2]);
      if(lastAssociation.separate) {
        lastAssociation.separate = false;
      }
      if(required == true) {
        lastAssociation.required = true
      }
      if (this._type !== "grouping" && lastAssociation.attributes.includes("id") == false) {
        lastAssociation.attributes.push("id");
      }
      if (lastAssociation.attributes.includes(parts[parts.length - 1] as keyof A) == false) {
        lastAssociation.attributes.push(parts[parts.length - 1] as keyof A);
      }
    }

    private addToGroup (associationPath: string[])
    {
      let currentPath = '';
      for (const part of associationPath) {
        if (currentPath) {
          currentPath += `.${part}`;
        } else {
          currentPath = part;
        }
        const idPath = `${currentPath}.id`;
        if (!this._groupArray.includes(idPath)) {
          this._groupArray.push(idPath);
        }
      }
    }

    private addToSort (keys: string[], desc: boolean): string[]
    {
      const new_sort: string[] = []
      const key = keys.shift()
  
      if (key) new_sort.push(key, ...this.addToSort(keys, desc))
      else new_sort.push(desc ? "DESC" : "ASC")

      return new_sort
    }

    private  formatAssociations(attrs: AttributesCondition[] | undefined = this._attributes): void
    {
      if(!attrs) return;
      if(this._type !== "data") return;

      attrs = attrs.filter(a => a.association == true)
      
      const attr = attrs.shift();
      if(!attr) return
  
      let currentInclude = this._result.include;
  
      const parts = attr.field.split('.');
      
      let currentPath: string[] = [];
  
      let groupBy = true;
  
      for (let i = 0; i < parts.length; i++) {
  
        const associationName = parts[i];
  
        currentPath.push(associationName);
  
        const association = this.findOrCreateAssociation(currentInclude, associationName);
        if(i == parts.length - 1) {
          if(attr.separate !== null) {
            association.subQuery = attr.separate
          }
          if(attr.required !== null) {
            association.required = attr.required
          }
        }
  
        if(association.separate == true) {
          groupBy = false;
        }
  
        if (!association.include) association.include = [];
  
        currentInclude = association.include;
  
      }
      if(groupBy) {
        this.addToGroup(currentPath);
      }
      
      return this.formatAssociations(attrs)
    }
  
    private formatAttributes(attrs: AttributesCondition[] | undefined = this._attributes): void
    {
      if(!attrs) return;
      if(this._type !== "data") return;

      attrs = attrs.filter(a => a.association == false)
      
      const attr = attrs.shift();
      if(!attr) return
  
      
      const parts = attr.field.split('.');
      if (parts.length === 1) {
        if ((this._result.attributes as string[]).includes(parts[0]) == false) {
          (this._result.attributes as string[]).push(parts[0]);
        }
        return this.formatAttributes(attrs)
      }
      let currentInclude = this._result.include;
      
      let currentPath: string[] = [];
  
      for (let i = 0; i < parts.length - 1; i++) {
        const associationName = parts[i];
  
        const association = this.findOrCreateAssociation(currentInclude, associationName);
        if (!association.include) association.include = [];
  
        if (i < parts.length - 2) currentInclude = association.include;
  
      }
      const lastAssociation = this.findOrCreateAssociation(currentInclude, parts[parts.length - 2]);
      if (!lastAssociation.attributes.includes(parts[parts.length - 1] as keyof A)) {
        lastAssociation.attributes.push(parts[parts.length - 1] as keyof A);
      }
  
      return this.formatAttributes(attrs)
    }  

    private distinctGroups(groups: DxGroup | DxGroup[] | undefined = this._group): void
    {
      if(!groups || (Array.isArray(groups) && groups.length == 0)) return;
      
      let groupFields = Array.isArray(this._group) ? this._group : [this._group];
      
      groupFields = groupFields.reverse()
      
      const g = groupFields.shift()
      if(!g) return;
  
      const parts = g.selector.split('.')
      let currentInclude = this._result.include;
    
      for (let i = 0; i < parts.length - 1; i++) {
        const associationName = parts[i];
        const association = this.findOrCreateAssociation(currentInclude, associationName);
        if (!association.include) {
          association.include = [];
        }
        if (i < parts.length - 2) {
          currentInclude = association.include;
        }
      }

      if((this._result.attributes as string[])[0] !== g.selector)  {
        this._result.attributes = [
          [this._db.fn("DISTINCT", this._db.col(g.selector)), g.selector],
          [this._db.fn("COUNT", this._db.fn("DISTINCT", this._db.col(`id`))), "count"],
        ];
      }
      return this.distinctGroups(groupFields as DxGroup | DxGroup[])
    }
    
     private formatGroup (groups: DxGroup | DxGroup[] | undefined = this._group): void
    {
      if(!groups || (Array.isArray(groups) && groups.length == 0)) return;
      
      let groupFields = Array.isArray(this._group) ? this._group : [this._group];
      
      groupFields = groupFields.reverse()
      
      const g = groupFields.shift()
      if(!g) return;
  
      const parts = g.selector.split('.')
      this.addToAttributes(parts, true)

      const index = this._groupArray.findIndex(el => el == g.selector.replace(/\.(\w+)$/, '.id'))
      if (index !== -1) this._groupArray.splice(index, 1)
      this._groupArray.unshift(g.selector.replace(/\.(\w+)$/, '.id'));
      
      if(this._result.type == "grouping") {
        const new_sort = this.addToSort(parts, g.desc)
        if(!this._result.order || !this._result.order.length) this._result.order = []
        this._result.order.unshift(new_sort as OrderItem);
        // if ((this._result.attributes as string[]).includes("id")) this._groupArray.push(`id`)
      }
  
  
      this._result.group = this._groupArray;
      
      return this.formatGroup(groupFields as DxGroup | DxGroup[])
    }

    private formatSort (sorts: DxSort | DxSort[] | undefined = this._sorts)
    {
      if(this._type == "default") return;
      else if(this._type == "grouping") return;
      if(!sorts) return;
    
      let order: FindOptions["order"] = [];
  
      const push_order = (keys: string[], desc: boolean): string[] => {
        const new_sort: string[] = []
  
        const key = keys.shift()
    
        if (key) new_sort.push(key, ...push_order(keys, desc))
        else new_sort.push(desc ? "DESC" : "ASC")
    
        return new_sort;
      }
    
      if (Array.isArray(sorts)) {
        for (const sort of sorts) {
          const keys: string[] = sort.selector.split('.')
          this.addToAttributes(keys)
  
          const pushed_order = push_order(keys, sort.desc)
          if (pushed_order) order.push(pushed_order as any)
        }
      }
      else {
        //TODO QUEBRA EM ORDER DE RELAÇÃO
        const keys: string[] = sorts.selector.split('.')
        this.addToAttributes(keys)
        const pushed_order = push_order(keys, sorts.desc)
        if (pushed_order) order.push(pushed_order as any)
    
      }
      if(this._result.type !== "default") {
        this._result.order = order;
      }
    }

    private applyWhereCondition(path: string[], conditionGroup: DxCondition<A>, negation: boolean = false)
    {
      const [field, condition, value] = conditionGroup;
      let currentInclude = this._result.include;
      let currentPath: string[] = [];
  
      for (let i = 0; i < path.length - 1; i++) {
        const associationName = path[i];
        currentPath.push(associationName);
        const association = this.findOrCreateAssociation(currentInclude, associationName);

        association.required = true
        association.subQuery = true
        if (!association.include) {
          association.include = [];
        }
    
        if (i < path.length - 2) {
          currentInclude = association.include;
        }
      }
  
      this.addToGroup(currentPath);
  
      this.findOrCreateAssociation(currentInclude, path[path.length - 2]);
    }
  
    private processFilter(conditionGroup: DxConditionGroup<A>, negacao: boolean = false): any
    {
      if (Array.isArray(conditionGroup[0])) 
      {
        let currentWhere: any = {};
        let currentOperator: LogicalOperator | null = null;

        for (let i = 0; i < conditionGroup.length; i++) {
          const currentCondition = conditionGroup[i];

          if (typeof currentCondition === "string") currentOperator = currentCondition as LogicalOperator;

          else {
            const whereCondition = this.processFilter(currentCondition as DxConditionGroup<A>, negacao);

            if (!currentOperator) currentWhere = whereCondition;
            else {
              const operatorMap = { "and": Op.and, "or": Op.or };
              const notOperatorMap = { "and": Op.or, "or": Op.and };

              if (!currentWhere[operatorMap[currentOperator]]) {
                currentWhere = { 
                  ...negacao == false ? {
                    [operatorMap[currentOperator]]: [currentWhere] 
                  } : {
                    [notOperatorMap[currentOperator]]: [currentWhere] 
                  }
                };
              }
              if(negacao == false) { 
                currentWhere[operatorMap[currentOperator]].push(whereCondition);
              }
              else { 
                currentWhere[notOperatorMap[currentOperator]].push(whereCondition);
              }
            }
          }
        }
        return currentWhere;
      } 
      else if( conditionGroup[0] == '!')
      {
        const [_, [pathString, operator, value]] = conditionGroup as DxNotCondition<A>;
        if(Array.isArray(pathString)) {
          return this.processFilter(conditionGroup[1] as DxConditionGroup<A>, true)
        }
        const pathParts = (pathString as string).split('.');
        const field = pathParts.length > 1 ? `$${(pathString as string)}$` : pathString as string;

        if (pathParts.length > 1) this.applyWhereCondition(pathParts, conditionGroup as DxCondition<A>, true);

        return this.formatCondition([field, operator, value], this._entidade, true);
      } 
      else 
      {
        const [pathString, operator, value] = conditionGroup as DxCondition<A>;
        const pathParts = (pathString as string).split('.');
        const field = pathParts.length > 1 ? `$${(pathString as string)}$` : (pathString as string);

        if (pathParts.length > 1) this.applyWhereCondition(pathParts, conditionGroup as DxCondition<A>, negacao);
        

        return this.formatCondition([field, operator, value], this._entidade, negacao);
      }
    }

    private formatFilter()
    {
      if(!this._filters) return;
      else if(this._type == "data") return;

      this._result.where = this.processFilter(this._filters)
    }

    private cleanEmptyIncludes (includes: AttributeInclude<A>[])
    {
      includes.forEach((include) => {
        if (include.include && include.include.length === 0) {
          delete include.include;
        } else if (include.include) {
          this.cleanEmptyIncludes(include.include);
        }
      });
    }
    
    private format(): FindOptions<A>
    {
      this.formatAssociations();
      this.formatAttributes();
      
      this.formatSort()
      
      
      this.formatGroup()
      // if(this._type == "grouping") this.distinctGroups();
      
      this.formatFilter();
      

      this.cleanEmptyIncludes(this._result.include)

      const { type, ...find_options } = this._result
      if(type == "filters" && this._field)
      {
          const payload: FindOptions<A> = {
          ...find_options as FindOptions<A>,
          attributes: this._result.group!.map(el => [this._db.fn("DISTINCT", this._db.col(el)), el]),
          // attributes: [
          //   [this._db.fn("DISTINCT", this._db.col(this._field)), this._field]
          // ],
          order: this._result.group!.map(el => [el, "ASC"])
          // order: [[this._field, "ASC"]]
        }
  
        return payload;
      }
      return find_options as FindOptions<A>;
    }

    get formatted(){
      return this.format();
    }
    
}
