import {App} from "./src/config/App";
import { error } from "./src/modules/logger";

const apollo :App = new App();
apollo.setupApp()
.then(()=>{
    apollo.listen();
})
.catch((e)=>{
    error("Failure to launch: ", e);
})