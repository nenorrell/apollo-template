export const cleanObject = (obj :any) :void =>{
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
}