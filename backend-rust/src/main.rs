mod cases;
#[macro_use] extern crate rocket;
use std::str;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index,cases::cases])
}
