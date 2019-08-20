export default interface IBudget
{

    min:number,
    max:number,
    usermin?:number,
    usermax?:number,
    step:number,
    onChange:any
}