from flask import Blueprint, request, jsonify
from datetime import datetime
from models import Mail, Character
from db import db

mail_bp = Blueprint('mail', __name__)

@mail_bp.route('/mailbox/<receiver>', methods=['GET'])
def get_mailbox(receiver):
    mailbox = Mail.query.filter_by(receiver=receiver).order_by(Mail.date.desc()).all()
    return jsonify([
        {'id': m.id, **m.as_dict()} for m in mailbox
    ])

@mail_bp.route('/mail/<int:id>/status', methods=['PUT'])
def update_mail_status(id):
    mail = db.session.get(Mail, id)
    if not mail:
        return jsonify({'error': 'Mail not found'}), 404
    data = request.json
    if "status" in data:
        mail.status = data["status"]
        db.session.commit()
    return jsonify({'id': mail.id, **mail.as_dict()})

@mail_bp.route('/mail/<int:id>', methods=['DELETE'])
def delete_mail(id):
    mail = db.session.get(Mail, id)
    if not mail:
        return jsonify({'error': 'Mail not found'}), 404
    db.session.delete(mail)
    db.session.commit()
    return jsonify({'result': 'ok'})

@mail_bp.route('/mail', methods=['POST'])
def create_mail():
    data = request.json
    title = data.get('title', '공지')
    content = data.get('content', '')
    mail_type = data.get('type', 'notice')  # "notice" or "normal"
    receiver = data.get('receiver', '')

    sent = []

    if receiver == "ALL":
        all_characters = Character.query.all()
        for c in all_characters:
            mail = Mail(
                receiver=c.character_name,
                title=title,
                content=content,
                type=mail_type,
                status='unread',
                date=datetime.now().isoformat()
            )
            db.session.add(mail)
            db.session.flush()
            sent.append({'id': mail.id, **mail.as_dict()})
        db.session.commit()
        return jsonify({'result': 'ok', 'sent': sent}), 201
    else:
        mail = Mail(
            receiver=receiver,
            title=title,
            content=content,
            type=mail_type,
            status='unread',
            date=datetime.now().isoformat()
        )
        db.session.add(mail)
        db.session.commit()
        return jsonify({'id': mail.id, **mail.as_dict()}), 201

@mail_bp.route('/mail/all', methods=['GET'])
def get_all_mails():
    all_mail_list = Mail.query.order_by(Mail.date.desc()).all()
    return jsonify([
        {'id': m.id, **m.as_dict()} for m in all_mail_list
    ])
