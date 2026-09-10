import { request as httpRequest
  // , RequestOptions 
} from "node:http";
import { request as httpsRequest } from "node:https";

export function instrumentHttp() {
  // Reserved for transparent Node HTTP instrumentation.
  // Keep this opt-in until the backend event schema is finalized.
  return { 
    httpRequest, 
    httpsRequest, 
    // RequestOptions 
  };
}
