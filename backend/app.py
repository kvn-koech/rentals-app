from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Property, Booking

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rentals.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

import random
from faker import Faker

fake = Faker()
kenyan_locations = ['Westlands, Nairobi', 'Kilimani, Nairobi', 'Karen, Nairobi', 'Nyali, Mombasa', 'Milimani, Kisumu', 'Runda, Nairobi', 'Diani Beach, Kwale', 'Nakuru City', 'Eldoret Town', 'Kileleshwa, Nairobi']
house_types = ['Apartment', 'Mansion', 'Bungalow', 'Townhouse', 'Penthouse', 'Studio']
adjectives = ['Luxurious', 'Spacious', 'Cozy', 'Modern', 'Elegant', 'Secure', 'Beautiful']
images = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    'https://images.unsplash.com/photo-1502672260266-1c1e52ab0645?w=500',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?w=500',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500'
]

db.init_app(app)

with app.app_context():
    db.create_all()
    # Seed some initial data if empty
    if not User.query.first():
        landlord1 = User(username='landlord_kamau', role='landlord')
        customer1 = User(username='customer_wambui', role='customer')
        db.session.add_all([landlord1, customer1])
        db.session.commit()
        
        properties = []
        for _ in range(9):
            title = f"{random.choice(adjectives)} {random.choice(house_types)} in {random.choice(kenyan_locations).split(',')[0]}"
            description = fake.paragraph(nb_sentences=4)
            # Round prices to nearest 5000
            price = random.randint(5, 50) * 5000.0
            location = random.choice(kenyan_locations)
            image_url = random.choice(images)
            
            prop = Property(title=title, description=description, price=price, location=location, landlord_id=landlord1.id, image_url=image_url)
            properties.append(prop)
            
        db.session.add_all(properties)
        db.session.commit()

# --- API Endpoints ---

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@app.route('/api/properties', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return jsonify([p.to_dict() for p in properties])

@app.route('/api/properties/<int:prop_id>', methods=['GET'])
def get_property(prop_id):
    prop = Property.query.get_or_404(prop_id)
    return jsonify(prop.to_dict())

@app.route('/api/properties', methods=['POST'])
def create_property():
    data = request.json
    new_prop = Property(
        title=data['title'],
        description=data['description'],
        price=float(data['price']),
        location=data['location'],
        image_url=data.get('image_url', ''),
        landlord_id=data['landlord_id']
    )
    db.session.add(new_prop)
    db.session.commit()
    return jsonify(new_prop.to_dict()), 201

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.json
    new_booking = Booking(
        property_id=data['property_id'],
        customer_id=data['customer_id'],
        start_date=data['start_date'],
        end_date=data['end_date']
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify(new_booking.to_dict()), 201

@app.route('/api/landlord/<int:landlord_id>/properties', methods=['GET'])
def get_landlord_properties(landlord_id):
    properties = Property.query.filter_by(landlord_id=landlord_id).all()
    return jsonify([p.to_dict() for p in properties])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
