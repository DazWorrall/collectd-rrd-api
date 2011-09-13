from pyrrd import rrd
import os

def get_dirs(dir):
	dirs = []
	
	for dirname in os.listdir(dir):
		p = os.path.join(dir, dirname)
		
		if os.path.isdir(p):
			dirs.append(dirname)
			
	return dirs

def get_files(path, extension):
	files = []
	
	for file in os.listdir(path):
		basename, ext = os.path.splitext(file)
		
		if extension == ext:
			files.append(file)
			
	return files

class StatsReader:
	def __init__(self, path):
		self.path = path
	
	def get_hosts(self):
		return get_dirs(self.path)
		
	def get_instances_for_host(self, host):
		path = os.path.join(self.path, host)
		
		if not os.path.isdir(path):
			raise Exception('Host "%s" is not valid' % host)
		
		return get_dirs(path)
	
	def get_types_for_host_and_instance(self, host, instance):
		path = os.path.join(self.path, host, instance)
		
		if not os.path.isdir(path):
			raise Exception('Host "%s" with instance "%s" is not valid' %  (host, instance))
		
		return [x[:-4] for x in get_files(path, '.rrd')]
	
	def get_data(self, host, instance, type, start=None, end=None):
		path = os.path.join(self.path, host, instance, ''.join([type, '.rrd']))
	
		if not os.path.isfile(path):
			raise Exception('Host "%s" with instance "%s" and type "%s" is not valid' % (host, instance, type))
		
		df = rrd.RRD(path)
		
		return df.fetch(start=start, end=end)
		
		