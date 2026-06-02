from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'landlord' or 'customer'
    properties = db.relationship('Property', backref='landlord', lazy=True)
    bookings = db.relationship('Booking', backref='customer', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'role': self.role}

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(300), default='')
    landlord_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bookings = db.relationship('Booking', backref='property', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'description': self.description,
            'price': self.price, 'location': self.location,
            'image_url': self.image_url, 'landlord_id': self.landlord_id
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id, 'property_id': self.property_id,
            'customer_id': self.customer_id,
            'start_date': self.start_date, 'end_date': self.end_date
        }
