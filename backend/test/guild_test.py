import pytest
from app import app, db
from models import Guild, Character
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()
        yield client

def test_guild_crud(client):
    #테스트용 캐릭터
    char_payload = {
        "character_name": "길드원",
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
    rv = client.post('/api/character', json=char_payload)
    assert rv.status_code == 201

    #생성
    guild_payload = {
        "date": None,
        "world_name": "아덴",
        "guild_name": "테스트길드",
        "guild_level": 1,
        "guild_fame": 10,
        "guild_point": 5,
        "guild_master_name": "마스터",
        "guild_member_count": 0,
        "guild_member": []
    }
    rv = client.post('/api/guild', json=guild_payload)
    assert rv.status_code == 201
    guild_id = rv.get_json()['id']

    #조회
    rv = client.get('/api/guilds')
    assert rv.status_code == 200
    assert len(rv.get_json()) == 1

    #단일 조회
    rv = client.get(f'/api/guild/{guild_id}')
    assert rv.status_code == 200
    assert rv.get_json()['guild_name'] == "테스트길드"

    #추가
    rv = client.post(f'/api/guild/{guild_id}/add_member', json={"character_name": "길드원"})
    assert rv.status_code == 200
    assert "길드원" in rv.get_json()['guild']['guild_member']

    #수정
    rv = client.put(f'/api/guild/{guild_id}', json={"guild_level": 2})
    assert rv.status_code == 200
    assert rv.get_json()['guild_level'] == 2

    #삭제
    rv = client.delete(f'/api/guild/{guild_id}')
    assert rv.status_code == 200
    assert rv.get_json()['result'] == 'ok'
