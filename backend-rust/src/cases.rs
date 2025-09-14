use rocket::serde::{Serialize, json::Json};

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Case { id_case: String, name: String, description: String, created_at: String}

#[get("/cases/<id_case>")]
pub fn cases(id_case: String) -> Json<Case> {
    Json(Case { id_case: id_case, name: "TEST".to_string(), description: "TEST".to_string(), created_at: "TEST".to_string() })
}