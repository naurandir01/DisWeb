import axios from "axios";
import { data } from "react-router";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


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