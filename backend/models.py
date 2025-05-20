from db import db
from datetime import datetime

class Character(db.Model):
    __tablename__ = 'characters'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    character_name = db.Column(db.String(50), nullable=False)
    world_name = db.Column(db.String(20), nullable=False)
    character_gender = db.Column(db.String(10), nullable=False)
    character_class = db.Column(db.String(20), nullable=False)
    character_class_level = db.Column(db.Integer, nullable=False)
    character_level = db.Column(db.Integer, nullable=False)
    character_exp = db.Column(db.Integer, nullable=False)
    character_exp_rate = db.Column(db.Integer, nullable=False)
    character_guild_name = db.Column(db.String(50), nullable=True)
    character_image = db.Column(db.String(200), nullable=True)
    date = db.Column(db.String(32), nullable=False, default=lambda: datetime.now().isoformat())

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Guild(db.Model):
    __tablename__ = 'guilds'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.String(32), nullable=False, default=lambda: datetime.now().isoformat())
    world_name = db.Column(db.String(20), nullable=False)
    guild_name = db.Column(db.String(50), nullable=False)
    guild_level = db.Column(db.Integer, nullable=False)
    guild_fame = db.Column(db.Integer, nullable=False)
    guild_point = db.Column(db.Integer, nullable=False)
    guild_master_name = db.Column(db.String(50), nullable=False)
    guild_member_count = db.Column(db.Integer, nullable=False)
    guild_member = db.Column(db.Text, nullable=False)  # JSON string

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Mail(db.Model):
    __tablename__ = 'mails'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    receiver = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), nullable=False, default='notice')
    status = db.Column(db.String(20), nullable=False, default='unread')
    date = db.Column(db.String(32), nullable=False, default=lambda: datetime.now().isoformat())

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Ranking(db.Model):
    __tablename__ = 'rankings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    character_name = db.Column(db.String(50), nullable=False)
    world_name = db.Column(db.String(20), nullable=False)
    character_level = db.Column(db.Integer, nullable=False)
    character_exp = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(32), nullable=False, default=lambda: datetime.now().isoformat())
    rank_type = db.Column(db.String(20), nullable=False, default='total')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
