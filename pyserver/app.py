
from flask import Flask, request, jsonify
from sympy import *
import numpy as np
from pysr import PySRRegressor

app = Flask(__name__)

@app.route('/diff_eqn_generation', methods=['POST'])
def diff_eqn_generation():
    data = request.json  # This is your array from JavaScript
    
    x = np.array(data['array1'])
    x= x.reshape(-1,1)

    y = np.array(data['array2'])

    model = PySRRegressor(
        niterations=30,  # < Increase for better results
        binary_operators=["+", "*"],
        unary_operators=[
            "cos",
            "exp",
            "sin",
            "inv(x) = 1/x",

        ],
        extra_sympy_mappings={"inv": lambda x: 1 / x},
        elementwise_loss="loss(prediction, target) = (prediction - target)^2",
        
    )

    model.fit(x, y) # change y1 to y2,y3,y4

    expr = model.sympy()

    x0, y = symbols('x0 y')

    differentiated_expr = diff(expr, x0)
    

    result = str(differentiated_expr)  # Example result
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
