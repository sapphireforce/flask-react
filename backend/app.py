from flask import Flask
from flask_cors import CORS
from db import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@127.0.0.1:3306/game_user'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db.init_app(app)

from routes.character import character_bp
from routes.ranking import ranking_bp
from routes.guild import guild_bp
from routes.mail import mail_bp

app.register_blueprint(character_bp, url_prefix='/api')
app.register_blueprint(ranking_bp, url_prefix='/api')
app.register_blueprint(guild_bp, url_prefix='/api')
app.register_blueprint(mail_bp, url_prefix='/api')

@app.route('/')
def index():
    return 'Hello flask world!'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
