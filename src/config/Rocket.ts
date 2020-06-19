import {green, yellow} from "chalk"
import {info, debug, error} from "../modules/logger";

export class Rocket{
    public launch(){
        info(`${green(`
       ^
      / \\
     /___\\
    |=   =|
    |  A  |
    |  P  |
    |  O  |
    |  L  |
    |  L  |
    |  O  |
   /|##!##|\\
  / |##!##| \\
 /  |##!##|  \\
|  / ${yellow(`( | )`)} \\  |
| /  ${yellow(`( | )`)}  \\ |
|/   ${yellow(`( | )`)}   \\|`)}${yellow(`
    ((   ))
   ((  :  ))
   ((  :  ))
    ((   ))
     (( ))
      ( )
       .
       `)}`)
    }
}