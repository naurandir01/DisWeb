import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// --- JWT authentication (sprint 1) ---

// Inject the JWT access token in every request
api.interceptors.request.use((config) => {
    // Legacy callers already use '/api/...' absolute paths while this
    // instance has baseURL '/api'. Normalize to avoid '/api/api/...'.
    if (config.url && config.url.startsWith('/api/')) {
        config.url = config.url.slice(4);
    }
    const token = Cookies.get('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// On 401: refresh the expired access token once, then replay the request
api.interceptors.response.use(undefined, async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        const refresh = Cookies.get('refresh_token');
        if (refresh) {
            const res = await axios.post('/api/token/refresh/', { refresh });
            Cookies.set('access_token', res.data.access);
            // SIMPLE_JWT has ROTATE_REFRESH_TOKENS=True
            Cookies.set('refresh_token', res.data.refresh);
            return api(original);
        }
    }
    return Promise.reject(error);
});



// Shared intercepted instance: injects the JWT on every request and
// refreshes it automatically on 401. Exported as default so legacy
// `import API from '../components/api/axios'` callers benefit from it too.
export default api;

export const caseAPI = {
    getCases : () => api.get('/cases/'),
    getCase : (id_case:any)=> api.get(`/cases/${id_case}/`),
    deleteCase : (id_case:any) => api.delete(`/cases/${id_case}/`),
    getCaseSources : (id_case:any) => api.get(`/cases/${id_case}/sources`),
    getCaseMeilliSettings: (id_case:any) => api.get(`/cases/${id_case}/meili`),
    addCase : (data:FormData,headers:any) => api.post('/cases/',data,headers),
    getCaseSourceNotLink : (id_case:any) => api.get(`/cases/${id_case}/sources/add`),
}

export const sourceAPI = {
    getSource : (id_source:any) => api.get(`/sources/${id_source}/`),
    deleteSource : (id_source:any) => api.delete(`/sources/${id_source}/`),
    addSource : (data:FormData) => api.post('/sources/',data,{headers:{'Content-Type':'multipart/form-data'}}),
}

export const artefactAPI = {
    getSourceArtefact:(id_source:any,artefact_name:any,params:any) => api.get(`/sources/${id_source}/artefacts/${artefact_name}/meilisearch`,params),
    getSourceRegistryKeys: (id_source:any,params:any)=> api.get(`/sources/${id_source}/registry/keys/`,params),
    getSourceRegistryValues: (id_source:any,params:any)=> api.get(`/sources/${id_source}/registry/values/`,params),
    getSourceRegistryDataGrid: (id_source:any,min:any,max:any,params:any)=> api.get(`/sources/${id_source}/registry/${min}/${max}`,params),
    getSourceRegistrySize: (id_source:any,params:any)=> api.get(`/sources/${id_source}/registry/size`,params),
    runSourceArtefactPlugin: (id_source:any,artefact_name:any) => api.get(`/sources/${id_source}/artefacts/${artefact_name}`),
}

export const taskAPI = {
    getSourceTask: (id_source:any,task_name:any) => api.get(`/sources/${id_source}/tasks/${task_name}`),
}

export const fsAPI = {
    getFile : (id_source:any,file_path:any) => api.get(`/sources/${id_source}/fs/get_file?file_path=${file_path}`,{responseType:'blob'}),
    getFileHexdump : (id_source:any,file_path:any) => api.get(`/sources/${id_source}/fs/get_file_hexdump?file_path=${file_path}`),

}

export const iocAPI = {
    addIOC : (data:FormData) => api.post('/iocs/',data,{headers:{'Content-Type':'multipart/form-data'}}),
    getIOCtypes : () => api.get('/iocs_types/'),
    addIOCType : (data:FormData) => api.post('/iocs_types/',data,{headers:{'Content-Type':'multipart/form-data'}}),
    deleteIOCType : (id_type:any) => api.delete(`/iocs_types/${id_type}/`),

}

export const yaraAPI = {
    getYaraRules : () => api.get('/yara/'),
    deleteYaraRule : (id_yararule:any) => api.delete(`/yara/${id_yararule}/`),
    addYaraRule : (data:FormData) => api.post('/yara/',data,{headers:{'Content-Type':'multipart/form-data'}}),
    getYaraRule : (id_yararule:any) => api.get(`/yara/${id_yararule}/`),
    modifyYaraRule : (id_yararule:any,data:FormData) => api.post(`/yara/${id_yararule}/`,data,{headers:{'Content-Type':'multipart/form-data'}}),
    runYaraRuleOnSource : (id_source:any,id_yararule:any) => api.get(`/sources/${id_source}/yara/${id_yararule}/`),
}

export const settingsAPI = {
    getIntegritySettings : () => api.get('/settings/integrity/'),
    updateIntegritySettings : (enabled:boolean,intervalMinutes:number) =>
        api.put('/settings/integrity/',{enabled:enabled,interval_minutes:intervalMinutes}),
    getIntegrityAudits : (limit:number=50) => api.get(`/audit/?action=SOURCE_HASH_VERIFY&limit=${limit}`),
}

export interface IntegritySettings {
    enabled: boolean;
    interval_minutes: number;
    updated_at: string;
}

export interface AuditEntry {
    timestamp: string;
    user: string;
    ip: string | null;
    action: string;
    target: string;
    detail: Record<string, unknown> | null;
}