from flask import Flask, request, jsonify
from sympy import *
import numpy as np
from pysr import PySRRegressor
from flask_cors import CORS
import pysindy as ps

app = Flask(__name__)
CORS(app, support_credentials=True) 

@app.route('/diff_eqn_generation', methods=['POST'])
def diff_eqn_generation():
    print("Model starts!")
    #data = request.json  # This is your array from JavaScript
    """
    data = {
                "attributeArray": [
                    292.9999999999999,
                    292.9999999999999,
                    292.9999999999999,
                    292.9999999999999,
                    292.9999999999999,
                    292.9999999999999,
                    292.9999999999999
                ],
                "timeArray": [
                    3426.6191991883384,
                    3555.180468628244,
                    4279.8873059079815,
                    4896.211895714359,
                    5504.211895714359,
                    6222.097680501884,
                    6874.085410447778
                ]
            }
    
    """
    x = np.arange(0, 8, 0.02)
    num_points = x.shape[0]
    y = np.sin(x)

    data = {
    "attributeArray": y.tolist(),
    "timeArray": x.tolist()
    }

    x = np.array(data['timeArray'])
    #x= x.reshape(-1,1)

    y = np.array(data['attributeArray'])
    #y = y.reshape(-1,1)
    """
    
    
    model = PySRRegressor(
        niterations=10,  # < Increase for better results
        binary_operators=["+", "*"],
        unary_operators=[
            "cos",
            "exp",
            "sin",
            "inv(x) = 1/x",

        ],
        extra_sympy_mappings={"inv": lambda x: 1 / x},
        elementwise_loss="loss(prediction, target) = (prediction - target)^2"
    )

    print(data)

    model.fit(x, y) # change y1 to y2,y3,y4

    expr = model.sympy()

    x0, y = symbols('x0 y')
    print(f"This is the expression {expr}")

    differentiated_expr = diff(expr, x0)
    """

    X = np.stack((y, x), axis= -1)
    t = x #timeArray

    poly_lib = ps.PolynomialLibrary(degree = 2)
    fourier_lib = ps.FourierLibrary()

    tensor_lib = poly_lib + fourier_lib 

    optimizer = ps.STLSQ(threshold=0.2)
    #optimizer = ps.SR3(threshold=0.2, trimming_fraction=0.1)
    model = ps.SINDy(feature_names=["x", "t"], feature_library=tensor_lib, optimizer = optimizer, discrete_time = False)
    #model_2 = ps.SINDy()
    model.fit(X, t=t)
        

    #result = str(differentiated_expr)  # Example result
    print("Execution Done!")
    print(f"This is the result:")
    model.print()
    


if __name__ == '__main__': 
    diff_eqn_generation()
    app.run(debug=True)
