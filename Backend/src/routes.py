from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, jsonify, request, current_app
import jwt
from .db import SessionLocal
from .models import Item, Lot, User

api_bp = Blueprint('api', __name__, url_prefix='/api')


def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.now() + timedelta(hours=12)
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token


def verify_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '')

        user_id = verify_token(token)
        if not user_id:
            return jsonify({'erro': 'Token inválido ou expirado'}), 401

        return f(*args, **kwargs)
    return decorated_function


@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    with SessionLocal() as session:
        user = session.query(User).filter_by(username=username).first()

    if user and user.check_password(password):
        token = generate_token(user.id)
        return jsonify({'mensagem': 'Login realizado com sucesso', 'token': token}), 200
    else:
        return jsonify({'erro': 'Usuário ou senha inválidos'}), 401

@api_bp.route('/items', methods=['POST'])
@login_required
def add_item():
    data = request.get_json() or {}

    try:
        name = data['name']
        price = float(str(data['price']).replace(',', '.'))
    except (KeyError, ValueError):
        return jsonify({'erro': 'Dados inválidos ou ausentes'}), 400

    new_item = Item(name=name, price=price)

    with SessionLocal() as session:
        session.add(new_item)
        session.commit()

    return jsonify({'mensagem': 'Item adicionado com sucesso'}), 201

@api_bp.route('/items', methods=['GET'])
@login_required
def list_items():
    query = request.args.get('name')

    with SessionLocal() as session:
        if query:
            items = session.query(Item).filter(Item.name.contains(query)).all()
        else:
            items = session.query(Item).all()

    list = [
        {
            'id': i.id,
            'name': i.name,
            'price': i.price,
        } for i in items
    ]
    return jsonify(list), 200

@api_bp.route('/items/<int:id>', methods=['PUT'])
@login_required
def edit_item(id):
    data = request.get_json() or {}

    try:
        with SessionLocal() as session:
            item = session.query(Item).filter_by(id=id).first()
            if item is not None:
                item.name = str(data['name'])
                priceStr = str(data['price']).replace(',', '.')
                item.price = float(priceStr)
                session.commit() 
            else:
                return jsonify({'erro': 'Item não foi encontrado'}), 404
    except (KeyError, ValueError):
        return jsonify({'erro': 'Dados inválidos ou ausentes'}), 400

    return jsonify({'mensagem': 'Item atualizado com sucesso'}), 200

@api_bp.route('/items/<int:id>', methods=['GET'])
@login_required
def get_item(id):

    with SessionLocal() as session:
        item = session.query(Item).filter_by(id=id).first()
        if item is not None:
            return jsonify({
                'id': item.id,
                'name': item.name,
                'price': item.price,
            }), 200
        return jsonify({'erro': 'Item não foi encontrado'}), 404

@api_bp.route('/items/<int:id>', methods=['DELETE'])
@login_required
def delete_item(id):

    with SessionLocal() as session:
        item = session.query(Item).filter_by(id=id).first()
        if not item:
            return jsonify({'erro': 'Item não foi encontrado'}), 404
        session.delete(item)
        session.commit()
    return jsonify({'mensagem': 'Item deletado com sucesso'}), 200

@api_bp.route('/lots', methods=['POST'])
@login_required
def add_lot():
    data = request.get_json() or {}

    date_format = "%Y-%m-%d"

    try:
        number = str(data['number'])
        quantity = int(data['quantity'])
        expiry_date = datetime.strptime(data['expiry_date'], date_format)
        item_id = int(data['item_id'])

    except (KeyError, ValueError):
        return jsonify({'erro': 'Dados inválidos ou ausentes'}), 400

    new_lot = Lot(number=number, quantity=quantity, expiry_date=expiry_date, item_id=item_id)

    with SessionLocal() as session:
        session.add(new_lot)
        session.commit()

    return jsonify({'mensagem': 'Lote adicionado com sucesso'}), 201

@api_bp.route('/lots', methods=['GET'])
@login_required
def list_lots():

    with SessionLocal() as session:
        lots = session.query(Lot).all()

    list = [
        {
            'id': l.id,
            'number': l.number,
            'quantity': l.quantity,
            'expiry_date': l.expiry_date,
            'item_id': l.item_id
        } for l in lots
    ]
    return jsonify(list), 200

@api_bp.route('/lots/<int:id>', methods=['PUT'])
@login_required
def edit_lot(id):
    data = request.get_json() or {}

    date_format = "%Y-%m-%d"

    try:
        with SessionLocal() as session:
            lot = session.query(Lot).filter_by(id=id).first()
            if lot is not None:
                lot.number = str(data['number'])
                lot.quantity = int(data['quantity'])
                lot.expiry_date = datetime.strptime(data['expiry_date'], date_format)
                lot.item_id = int(data['item_id'])
                session.commit() 
            else:
                return jsonify({'erro': 'Lote não foi encontrado'}), 404
    except (KeyError, ValueError):
        return jsonify({'erro': 'Dados inválidos ou ausentes'}), 400

    return jsonify({'mensagem': 'Lote atualizado com sucesso'}), 200

@api_bp.route('/lots/<int:id>', methods=['DELETE'])
@login_required
def delete_lot(id):

    with SessionLocal() as session:
        lot = session.query(Lot).filter_by(id=id).first()
        if not lot:
            return jsonify({'erro': 'Lote não foi encontrado'}), 404
        session.delete(lot)
        session.commit()
    return jsonify({'mensagem': 'Lote deletado com sucesso'}), 200

@api_bp.route('/lots/<int:id>', methods=['GET'])
@login_required
def get_lot(id):

    with SessionLocal() as session:
        lot = session.query(Lot).filter_by(id=id).first()
        if lot is not None:
            return jsonify({
                'id': lot.id,
                'quantity': lot.quantity,
                'expiry_date': lot.expiry_date,
                'item_id': lot.item_id,
            }), 200
        return jsonify({'erro': 'Lote não foi encontrado'}), 404