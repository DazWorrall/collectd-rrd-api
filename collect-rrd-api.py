from flask import Flask, request, json, jsonify, current_app
from functools import wraps
from rrdstats import StatsReader
import sys

if len(sys.argv) > 1:
    DATA_DIR = sys.argv[1]
else:
    DATA_DIR = '../sample-data/rrd'

app = Flask(__name__)
app.debug = True

reader = StatsReader(DATA_DIR)

def support_jsonp(f):
    """Wraps JSONified output for JSONP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = str(callback) + '(' + str(f(*args,**kwargs).data) + ')'
            return current_app.response_class(content, mimetype='application/javascript')
        else:
            return f(*args, **kwargs)
    return decorated_function

# Handlers
@app.route('/stat')
@support_jsonp
def get_hosts():
	return jsonify(hosts=reader.get_hosts())

@app.route('/stat/<host>')
@support_jsonp
def get_instances(host):
	return jsonify(instances=reader.get_instances_for_host(host))

@app.route('/stat/<host>/<plugin>')
@support_jsonp
def get_types(host, plugin):
	return jsonify(types=reader.get_types_for_host_and_instance(host, plugin))

@app.route('/stat/<host>/<plugin>/<stat>')
@support_jsonp
def get_values(host, plugin, stat):
	start = request.args.get('start', None)
	end = request.args.get('end', None)
	
	values = reader.get_data(host, plugin, stat, start, end)

	return jsonify(series=values)

@app.route('/')
def index():
    return render_template(
        'index.htm',
    )

if __name__ == "__main__":
    app.run(host='0.0.0.0')
