import {
  http,
  supabase
} from "@/shared/utils/request";
import type { UUID } from "crypto";

export interface Crx {
  code: UUID;
  access_token: string;
  expires_at: string;
  id?: number,
  created_at?: string,
}

export const setCrxCode = (crx: Crx) => {
  return supabase.from('login_codes').insert(crx).select()
//   return http.post<Crx>("/rest/v1/login_codes?select=*", crx);
};
