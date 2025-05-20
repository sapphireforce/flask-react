from flask import Blueprint, request, jsonify
from datetime import datetime
from models import Ranking, Character
from db import db

ranking_bp = Blueprint('ranking', __name__)

@ranking_bp.route('/ranking', methods=['POST'])
def create_ranking():
    data = request.json
    character_id = data.get('character_id')
    character = db.session.get(Character, character_id)
    if not character:
        return jsonify({'error': 'Character not found'}), 404

    ranking = Ranking(
        character_id=character.id,
        character_name=character.character_name,
        world_name=character.world_name,
        character_level=character.character_level,
        character_exp=character.character_exp,
        date=data.get('date', datetime.now().isoformat()),
        rank_type=data.get('rank_type', 'total')
    )
    db.session.add(ranking)
    db.session.commit()
    return jsonify({'id': ranking.id, **ranking.as_dict()}), 201

@ranking_bp.route('/rankings', methods=['GET'])
def get_rankings():
    rank_type = request.args.get('rank_type', 'total')
    rankings = Ranking.query.filter_by(rank_type=rank_type).order_by(
        Ranking.character_level.desc(),
        Ranking.character_exp.desc(),
        Ranking.date.asc()
    ).all()
    return jsonify([{'id': r.id, **r.as_dict()} for r in rankings])

@ranking_bp.route('/ranking/<int:id>', methods=['GET'])
def get_ranking(id):
    ranking = db.session.get(Ranking, id)
    if not ranking:
        return jsonify({'error': 'Ranking not found'}), 404
    return jsonify({'id': ranking.id, **ranking.as_dict()})

@ranking_bp.route('/ranking/<int:id>', methods=['PUT'])
def update_ranking(id):
    ranking = db.session.get(Ranking, id)
    if not ranking:
        return jsonify({'error': 'Ranking not found'}), 404
    data = request.json
    for field in ['character_level', 'character_exp', 'date', 'rank_type']:
        if field in data:
            setattr(ranking, field, data[field])
    db.session.commit()
    return jsonify({'id': ranking.id, **ranking.as_dict()})

@ranking_bp.route('/ranking/<int:id>', methods=['DELETE'])
def delete_ranking(id):
    ranking = db.session.get(Ranking, id)
    if not ranking:
        return jsonify({'error': 'Ranking not found'}), 404
    db.session.delete(ranking)
    db.session.commit()
    return jsonify({'result': 'ok'})
