from fastapi import FastAPI

app = FastAPI(title="Multi-Agent Data Analyst API")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running!"}
