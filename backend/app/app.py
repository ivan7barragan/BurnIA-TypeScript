from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    # Diagnóstico falso aleatorio para simular IA
    grados = ['Primer grado', 'Segundo grado', 'Tercer grado']
    grado = random.choice(grados)
    confianza = round(random.uniform(80, 99), 2)

    return jsonify({
        "grado": grado,
        "confianza": confianza,
        "recomendaciones": "Minecraft."
    })

if __name__ == "__main__":
    app.run(debug=True)
