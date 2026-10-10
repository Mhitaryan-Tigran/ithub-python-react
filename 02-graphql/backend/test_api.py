from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def gql(query, variables=None):
    return client.post("/graphql", json={"query": query, "variables": variables or {}}).json()


def test_flow():
    data = gql("{ allTasks { id title isCompleted category { name color } } }")["data"]["allTasks"]
    assert len(data) == 3 and data[0]["category"]["name"] == "Работа"
    made = gql("mutation($t: String!) { createTask(title: $t, category: \"Учёба\") { id isCompleted } }", {"t": "Новая задача"})["data"]["createTask"]
    done = gql("mutation($id: ID!) { completeTask(id: $id) { isCompleted } }", {"id": made["id"]})["data"]["completeTask"]
    assert done["isCompleted"] is True
    assert gql("mutation { createTask(title: \"ab\") { id } }")["errors"][0]["message"].startswith("Название")
