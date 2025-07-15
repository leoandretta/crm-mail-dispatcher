export const splitUrl = (url: string) => {
    const [route, query] = url.split('?');
    return { route, query };
}

export const normalizeString = (str: string): string => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
  
export const formatFilename = (str: string): string => {
    if(!str) return '';
    const match = normalizeString(str).match(/(.+)\.(.+)$/)
    if(!match) return '';

    let filename = match[1].replace(/\s/g, "_")
    filename += new Date().getTime()
    filename += `.${match[2]}`

    return filename;
}

export const formatContactName = (str: string): string => {
    if(!str) return ',';
    const [name] = str.split(' ');
    
    return name.substring(0,1).toUpperCase() + name.substring(1)
}