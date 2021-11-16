// type ReqMethod<T, A> = (...args :A[]) => Promise<T>;
// type CircuitState = "OPEN" | "CLOSED" | "PARTIAL";
// export type CircuitBreakerOptions = {
//     timeout :number
//     successThreshold :number
//     failThreshold :number
//     successCodes :number[]
// }

// export class Floodwall<response=any, args=any[]>{
//     private request :ReqMethod<response, args>;
//     private options :CircuitBreakerOptions = {
//         timeout: 10000,
//         successThreshold: 5,
//         failThreshold: 2,
//         successCodes: [200]
//     }
//     public state :CircuitState = "OPEN";
//     public successCount = 0;
//     public failCount = 0;

//     constructor(options ?:Partial<CircuitBreakerOptions>){
//         if(options){
//             this.options = {
//                 ...this.options,
//                 ...options
//             };
//         }
//     }

//     public async execute(request :ReqMethod<response, args>, args ?:args) :Promise<response>{
//         try{
//             await this.request()
//             if(this.options.successCodes.includes())
//         }
//         catch(e){
//             // handle failure
//         }
//     }
// }
