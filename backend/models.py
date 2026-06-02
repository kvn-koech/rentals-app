from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'landlord' or 'customer'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role
        }

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(120), nullable=False)
    image_url = db.Column(db.String(255), nullable=True) # Optional image
    landlord_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    landlord = db.relationship('User', backref=db.backref('properties', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'location': self.location,
            'image_url': self.image_url,
            'landlord_id': self.landlord_id
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.String(20), nullable=False) # Simplified as string (YYYY-MM-DD)
    end_date = db.Column(db.String(20), nullable=False)
    
    property = db.relationship('Property', backref=db.backref('bookings', lazy=True))
    customer = db.relationship('User', backref=db.backref('bookings', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'customer_id': self.customer_id,
            'start_date': self.start_date,
            'end_date': self.end_date
        }
