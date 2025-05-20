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

def test_mail_crud(client):
    #생성
    char_payload = {
        "character_name": "수신자",
        "world_name": "아덴",
        "character_gender": "여",
        "character_class": "마법사",
        "character_class_level": 1,
        "character_level": 10,
        "character_exp": 100,
        "character_exp_rate": 50,
        "character_guild_name": "",
        "character_image": ""
    }
    rv = client.post('/api/character', json=char_payload)
    assert rv.status_code == 201

    #메일 생성(단일)
    mail_payload = {
        "receiver": "수신자",
        "title": "환영",
        "content": "가입을 축하합니다",
        "type": "notice"
    }
    rv = client.post('/api/mail', json=mail_payload)
    assert rv.status_code == 201
    mail_id = rv.get_json()['id']

    #조회
    rv = client.get('/api/mailbox/수신자')
    assert rv.status_code == 200
    assert len(rv.get_json()) == 1

    rv = client.put(f'/api/mail/{mail_id}/status', json={"status": "read"})
    assert rv.status_code == 200
    assert rv.get_json()['status'] == "read"

    #삭제
    rv = client.delete(f'/api/mail/{mail_id}')
    assert rv.status_code == 200
    assert rv.get_json()['result'] == 'ok'
