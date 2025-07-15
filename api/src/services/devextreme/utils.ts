import dayjs from "dayjs";
import { AttributesCondition, DxGroup } from "./interfaces";
import { GroupItem } from "devextreme/data/custom_store";

export const formatColumn = (field: string): AttributesCondition[] => {
    const keys = field.split('.');
    const attributes: AttributesCondition[] = []      
    attributes.push({ association: false, field })
  
    for(let i = 0; i < keys.length - 1; i++) 
    {
      const attribute: AttributesCondition = { 
        association: true, 
        field: keys[i] 
      }
  
      const index = attributes.findIndex(el => el.field == keys[i] && el.association == attribute.association);
      if(index == -1) attributes.push(attribute);
    }
  
    return attributes;
  }
  
  export const formatColumns = (columns?: string[]): AttributesCondition[] => {
    if(!columns) return []
    
    return columns.reduce((acc: AttributesCondition[], curr) => {
        if(!curr) return acc;
  
        const attributes = formatColumn(curr)
  
        acc.push(...attributes);
  
        return acc;
    }, [])
  }
  
  export const formatValue = (field: string, value: any): undefined | string | Date | number | any => {
    if (typeof value === 'undefined' || value == null) return;
    if (['true', 'false'].includes(value)) return value == 'true';
    else if (typeof value == 'boolean') return value;
    else if (typeof value == 'number') return Number(value);
    else if (typeof value == 'string') return value.toString()
    else if (dayjs(value).isValid()) {
      const start_date = dayjs(value).set('hour', 0).set('minute', 0).set('second', 0).toDate()
      const end_date = dayjs(value).add(1, 'day').set('hour', 0).set('minute', 0).set('second', 0).toDate()
      return [
          [field, '>=', start_date],
          "and",
          [field, '<', end_date],
      ]
    }
    // else if (type == 'datetime' && dayjs(value).isValid()) return dayjs(value).toDate()
    return value;   
  }
  
  export const formatText = (field: string, value: any): undefined | string | Date | number | boolean => 
  {
    if (typeof value === 'undefined' || value == null) return;
    if (['true', 'false'].includes(value)) return value == 'true';
    else if (typeof value == 'boolean') return value;
    else if (typeof value == 'number') return Number(value);
    else if (dayjs(value).isValid()) return dayjs(value).format('DD/MM/YYYY')
    // else if (dayjs(value).isValid()) return dayjs(value).format('DD/MM/YYYY HH:mm')
    else if (typeof value == 'string') return value.toString()
    return value;   
  }
  
  export const groupDataBySelectors = <E>(data: {[key: string]: string, count: string }[], selectors?: DxGroup | DxGroup[]): GroupItem<E>[] | undefined  => {
    const currentSelector = Array.isArray(selectors) ? selectors[0] : selectors;
    if(!currentSelector) return;
  
    return data.map(curr => {
        return {
            key: curr[currentSelector.selector],
            text: curr[currentSelector.selector] ?? 'Não identificado(a)',
            count: parseInt(curr.count),
            items: null,
            summary: [parseInt(curr.count)]
        }
    }, []);
  }