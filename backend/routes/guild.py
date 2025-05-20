from flask import Blueprint, request, jsonify
from datetime import datetime
import json
from models import Guild, Character
from db import db

guild_bp = Blueprint('guild', __name__)

WORLD_NAMES = ["아덴", "이실로테", "기란"] #위치 너무 안좋다 

def validate_guild(data):
    required_fields = [
        "world_name", "guild_name", "guild_level", "guild_fame",
        "guild_point", "guild_master_name", "guild_member_count", "guild_member"
    ]
    for field in required_fields:
        if field not in data:
            return False, f"'{field}' 필드는 필수입니다."
    if data["world_name"] not in WORLD_NAMES:
        return False, f"world_name 값이 올바르지 않습니다."
    try:
        int(data["guild_level"])
        int(data["guild_fame"])
        int(data["guild_point"])
        int(data["guild_member_count"])
    except Exception:
        return False, "guild_level, guild_fame, guild_point, guild_member_count는 정수여야 합니다."
    if not isinstance(data["guild_member"], list) or not all(isinstance(m, str) for m in data["guild_member"]):
        return False, "guild_member는 문자열 리스트여야 합니다."
    return True, None

@guild_bp.route('/guild', methods=['POST'])
def create_guild():
    data = request.json
    is_valid, err_msg = validate_guild(data)
    if not is_valid:
        return jsonify({'error': err_msg}), 400

    guild = Guild(
        date=data.get("date", datetime.now().isoformat()),
        world_name=data["world_name"],
        guild_name=data["guild_name"],
        guild_level=int(data["guild_level"]),
        guild_fame=int(data["guild_fame"]),
        guild_point=int(data["guild_point"]),
        guild_master_name=data["guild_master_name"],
        guild_member_count=int(data["guild_member_count"]),
        guild_member=json.dumps(data["guild_member"])
    )
    db.session.add(guild)
    db.session.commit()
    result = guild.as_dict()
    result['guild_member'] = json.loads(result['guild_member'])
    return jsonify({'id': guild.id, **result}), 201

@guild_bp.route('/guilds', methods=['GET'])
def get_guilds():
    guilds = Guild.query.all()
    result = []
    for g in guilds:
        d = g.as_dict()
        d['guild_member'] = json.loads(d['guild_member'])
        result.append({'id': g.id, **d})
    return jsonify(result)

@guild_bp.route('/guild/<int:id>', methods=['GET'])
def get_guild(id):
    g = db.session.get(Guild, id)
    if not g:
        return jsonify({'error': 'Guild not found'}), 404
    d = g.as_dict()
    d['guild_member'] = json.loads(d['guild_member'])
    return jsonify({'id': g.id, **d})

@guild_bp.route('/guild/<int:id>', methods=['PUT'])
def update_guild(id):
    g = db.session.get(Guild, id)
    if not g:
        return jsonify({'error': 'Guild not found'}), 404

    data = request.json
    for key in [
        "date", "world_name", "guild_name", "guild_level",
        "guild_fame", "guild_point", "guild_master_name", "guild_member_count", "guild_member"
    ]:
        if key in data:
            if key in ["guild_level", "guild_fame", "guild_point", "guild_member_count"]:
                setattr(g, key, int(data[key]))
            elif key == "guild_member":
                if not isinstance(data[key], list) or not all(isinstance(m, str) for m in data[key]):
                    return jsonify({'error': "guild_member는 문자열 리스트여야 합니다."}), 400
                setattr(g, key, json.dumps(data[key]))
            else:
                setattr(g, key, data[key])
    db.session.commit()
    result = g.as_dict()
    result['guild_member'] = json.loads(result['guild_member'])
    return jsonify({'id': g.id, **result})

@guild_bp.route('/guild/<int:id>', methods=['DELETE'])
def delete_guild(id):
    g = db.session.get(Guild, id)
    if not g:
        return jsonify({'error': 'Guild not found'}), 404
    db.session.delete(g)
    db.session.commit()
    return jsonify({'result': 'ok'})

@guild_bp.route('/guild/<int:id>/add_member', methods=['POST'])
def add_guild_member(id):
    g = db.session.get(Guild, id)
    if not g:
        return jsonify({'error': 'Guild not found'}), 404

    data = request.json
    char_name = data.get("character_name")
    if not char_name:
        return jsonify({"error": "character_name is required"}), 400

    char = Character.query.filter_by(character_name=char_name).first()
    if not char:
        return jsonify({"error": "No such character"}), 404

    guild_members = json.loads(g.guild_member)
    if char_name in guild_members:
        return jsonify({"error": "Already in guild"}), 400

    guild_members.append(char_name)
    g.guild_member = json.dumps(guild_members)
    g.guild_member_count = len(guild_members)
    db.session.commit()

    char.character_guild_name = g.guild_name
    db.session.commit()

    result = g.as_dict()
    result['guild_member'] = guild_members
    return jsonify({"result": "success", "guild": result, "character": char.as_dict()})
