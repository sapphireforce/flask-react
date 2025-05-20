import pytest
from app import app, db
from models import Character

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()
        yield client

def test_character_crud(client):
    #생성
    payload = {
        "character_name": "테스트캐릭터",
        "world_name": "아덴",
        "character_gender": "남",
        "character_class": "전사",
        "character_class_level": 1,
        "character_level": 10,
        "character_exp": 100,
        "character_exp_rate": 50,
        "character_guild_name": "",
        "character_image": ""
    }
    rv = client.post('/api/character', json=payload)
    assert rv.status_code == 201
    char_id = rv.get_json()['id']

    #전체 조회
    rv = client.get('/api/characters')
    assert rv.status_code == 200
    assert len(rv.get_json()) == 1

    # 단일 조회
    rv = client.get(f'/api/character/{char_id}')
    assert rv.status_code == 200
    assert rv.get_json()['character_name'] == "테스트캐릭터"

    #수정
    rv = client.put(f'/api/character/{char_id}', json={"character_level": 99})
    assert rv.status_code == 200
    assert rv.get_json()['character_level'] == 99

    #삭제
    rv = client.delete(f'/api/character/{char_id}')
    assert rv.status_code == 200
    assert rv.get_json()['result'] == 'ok'

    #실패
    rv = client.get(f'/api/character/{char_id}')
    assert rv.status_code == 404
