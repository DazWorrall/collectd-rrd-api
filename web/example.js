(function($) {
	var dataUrl = 'http://127.0.0.1:5000/stat',
		activeHost, activeInstance, activeType, plot, $graph,
		graphOptions = {
			xaxes: [{
				mode: 'time'
			}]
		};
	
	function loadHosts(callback) {
		$.getJSON(dataUrl + '?callback=?', function(data) {
			callback(data.hosts);
		});
	}
	
	function loadInstances(host, callback) {
		$.getJSON(dataUrl + '/' + host + '?callback=?', function(data) {
			callback(data.instances);
		});
	}
	
	function loadTypes(host, instance, callback) {
		$.getJSON(dataUrl + '/' + host + '/' + instance + '?callback=?', function(data) {
			callback(data.types);
		});		
	}
	
	function loadValues(host, instance, type, start, end, callback) {
		$.getJSON(dataUrl + '/' + host + '/' + instance + '/' + type + '?start=' + start + '&end=' + end + '&callback=?', function(data) {
			callback(data.series);
		});				
	}
	
	$(document).ready(function() {
		var $hosts = $('#hosts'),
			$instances = $('#instances'),
			$types = $('#types'),
			$graph = $('#graph');
		
		// Load instances
		$hosts.delegate('a', 'click', function() {
			activeHost = $(this).attr('href').substring(1)			
			
			loadInstances(activeHost, function(instances) {
				var html = [];

				for (var i = 0; i < instances.length; ++i) {
					html.push('<li><a href="#' + instances[i] + '">' + instances[i] + '</a></li>');
				}

				$instances.html(html.join(''));						
			});
		});

		$instances.delegate('a', 'click', function() {
			activeInstance = $(this).attr('href').substring(1);
			
			loadTypes(activeHost, activeInstance, function(types) {
				var html = [];

				for (var i = 0; i < types.length; ++i) {
					html.push('<li><a href="#' + types[i] + '">' + types[i] + '</a></li>');
				}

				$types.html(html.join(''));			
			});
		});

		$types.delegate('a', 'click', function() {
			activeType = $(this).attr('href').substring(1);
			
			loadValues(activeHost, activeInstance, activeType, function(data) {
//				plot = $.plot($graph, graphData, $.extend({}, graphOptions, {
//					xaxis: {
//						min: from,
//						max: to,
//					}})
//				);
				
				var series = [];
				
				for (var i in data) {
					series.push(data[i]);
				}
				
				plot = $.plot($graph, series, graphOptions);
			})
		});

		loadHosts(function(hosts) {
			var html = [];
			
			for (var i = 0; i < hosts.length; ++i) {
				html.push('<li><a href="#' + hosts[i] + '">' + hosts[i] + '</a></li>');
			}
			
			$hosts.html(html.join(''));			
		});
		
		var start = 1315414680,
			end = 1315415430;
		
		loadValues('mastermoo.config', 'disk-sdd', 'disk_ops', start, end, function(data) {
//				plot = $.plot($graph, graphData, $.extend({}, graphOptions, {
//					xaxis: {
//						min: from,
//						max: to,
//					}})
//				);

			var series = [];

			for (var i in data) {
				series.push(data[i]);
			}

			plot = $.plot($graph, series, graphOptions);
		})
	});
})(jQuery);
