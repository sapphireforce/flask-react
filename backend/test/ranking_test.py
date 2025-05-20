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

def test_ranking_crud(client):
    #테스트 캐릭터
    char_payload = {
        "character_name": "랭킹캐릭",
        "world_name": "기란",
        "character_gender": "남",
        "character_class": "궁수",
        "character_class_level": 1,
        "character_level": 20,
        "character_exp": 300,
        "character_exp_rate": 80,
        "character_guild_name": "",
        "character_image": ""
    }
    rv = client.post('/api/character', json=char_payload)
    assert rv.status_code == 201
    character_id = rv.get_json()['id']

    #생성
    ranking_payload = {
        "character_id": character_id,
        "rank_type": "total"
    }
    rv = client.post('/api/ranking', json=ranking_payload)
    assert rv.status_code == 201
    ranking_id = rv.get_json()['id']

    #조회
    rv = client.get('/api/rankings')
    assert rv.status_code == 200
    assert len(rv.get_json()) == 1

    #단일 조회
    rv = client.get(f'/api/ranking/{ranking_id}')
    assert rv.status_code == 200

    #수정
    rv = client.put(f'/api/ranking/{ranking_id}', json={"character_level": 99})
    assert rv.status_code == 200
    assert rv.get_json()['character_level'] == 99

    #삭제
    rv = client.delete(f'/api/ranking/{ranking_id}')
    assert rv.status_code == 200
    assert rv.get_json()['result'] == 'ok'
