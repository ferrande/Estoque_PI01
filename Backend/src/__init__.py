from flask_cors import CORS
from flask import Flask
from .extensions import bcrypt

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = '-LLa,*1`zT-qei!'

    bcrypt.init_app(app)
    from .models import Base
    from .db import engine

    Base.metadata.create_all(bind=engine)

    from .db import SessionLocal
    from .models import User

    try:
        with SessionLocal() as session:
            existing = session.query(User).filter_by(username="admin").first()
            if not existing:
                admin = User(username="admin")
                admin.set_password("12345")
                session.add(admin)
                session.commit()
                print("Usuário admin criado (default)")
            else:
                print("Usuário admin já existe")
    except Exception:
        pass

    from .routes import api_bp
    app.register_blueprint(api_bp)

    return app