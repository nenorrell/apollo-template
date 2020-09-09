import {green, yellow} from "chalk"
import {debug} from "../modules/logger";

export class Rocket{
    public launch(){
        debug(`${green(`
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