from flask import Flask, request, jsonify
import subprocess
import os
import uuid

app = Flask(__name__)
UPLOAD_FOLDER = "inference/images"
MODEL_WEIGHTS = "./DataSetBurnIA.pt"

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió imagen'}), 400
    
    image = request.files['image']
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    image.save(filepath)

    # Ejecuta el script detect.py
    result = subprocess.run(
        ["python", "detect.py", "--weights", MODEL_WEIGHTS, "--source", filepath],
        capture_output=True,
        text=True
    )

    # Aquí deberías extraer los datos del resultado generado por detect.py
    # Supongamos que los resultados se guardan en un JSON o archivo similar
    # o puedes parsear stdout de `result.stdout`

    # Simulación:
    output = {
        "grado": "Segundo grado",
        "confianza": 91.5,
        "recomendaciones": "Lavar con agua fría, cubrir y consultar médico."
    }

    return jsonify(output)

if __name__ == "__main__":
    #app.run(port=5001, debug=True)
    app.run(host="detector.burn-ia.local", port=5001, debug=True)
