from datetime import datetime
from flask import Blueprint, request, jsonify
from models import Character
from db import db
character_bp = Blueprint('character', __name__)
#@todo 모아서 관리
WORLD_NAMES = ["아덴", "이실로테", "기란"]
GENDERS = ["남", "여"]
CLASSES = ["전사", "마법사", "궁수"]

def validate_character(data):
    required_fields = [
        "character_name",
        "world_name",
        "character_gender",
        "character_class",
        "character_class_level",
        "character_level",
        "character_exp",
        "character_exp_rate"
    ]
    for field in required_fields:
        if field not in data:
            return False, f"'{field}' 필드는 필수입니다."
    if data["world_name"] not in WORLD_NAMES:
        return False, f"world_name 값이 올바르지 않습니다."
    if data["character_gender"] not in GENDERS:
        return False, f"character_gender 값이 올바르지 않습니다."
    if data["character_class"] not in CLASSES:
        return False, f"character_class 값이 올바르지 않습니다."
    try:
        int(data["character_class_level"])
        int(data["character_level"])
        int(data["character_exp"])
        int(data["character_exp_rate"])
    except:
        return False, "character_class_level, character_level, character_exp, character_exp_rate는 정수여야 합니다."
    return True, None

@character_bp.route('/character', methods=['POST'])
def create_character():
    data = request.json
    data.setdefault("character_guild_name", "")
    data.setdefault("character_image", "")
    is_valid, err_msg = validate_character(data)
    if not is_valid:
        return jsonify({'error': err_msg}), 400

    char = Character(
        character_name=data["character_name"],
        world_name=data["world_name"],
        character_gender=data["character_gender"],
        character_class=data["character_class"],
        character_class_level=int(data["character_class_level"]),
        character_level=int(data["character_level"]),
        character_exp=int(data["character_exp"]),
        character_exp_rate=int(data["character_exp_rate"]),
        character_guild_name=data.get("character_guild_name", ""),
        character_image=data.get("character_image", ""),
        date=datetime.now().isoformat()
    )
    db.session.add(char)
    db.session.commit()
    return jsonify({'id': char.id, **char.as_dict()}), 201

@character_bp.route('/characters', methods=['GET'])
def get_characters():
    characters = Character.query.all()
    return jsonify([
        {'id': c.id, **c.as_dict()} for c in characters
    ])

@character_bp.route('/character/<int:id>', methods=['GET'])
def get_character(id):
    c = db.session.get(Character, id)
    if not c:
        return jsonify({'error': 'Character not found'}), 404
    return jsonify({'id': c.id, **c.as_dict()})

@character_bp.route('/character/<int:id>', methods=['PUT'])
def update_character(id):
    char = db.session.get(Character, id)
    if not char:
        return jsonify({'error': 'Character not found'}), 404

    data = request.json
    updatable_fields = [
        "character_name", "world_name", "character_gender", "character_class",
        "character_class_level", "character_level", "character_exp", "character_exp_rate",
        "character_guild_name", "character_image"
    ]
    for key in updatable_fields:
        if key in data:
            if key in ["character_class_level", "character_level", "character_exp", "character_exp_rate"]:
                setattr(char, key, int(data[key]))
            else:
                setattr(char, key, data[key])

    db.session.commit()
    return jsonify({'id': char.id, **char.as_dict()})

@character_bp.route('/character/<int:id>', methods=['DELETE'])
def delete_character(id):
    char = db.session.get(Character, id)
    if not char:
        return jsonify({'error': 'Character not found'}), 404
    db.session.delete(char)
    db.session.commit()
    return jsonify({'result': 'ok'})
